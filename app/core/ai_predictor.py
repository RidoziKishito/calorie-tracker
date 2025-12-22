"""
Vietnamese Food Classifier using EfficientNet-B3

This module provides AI-based food recognition for Vietnamese dishes.
The model architecture and preprocessing must match the training configuration exactly.
"""

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import os
from typing import Tuple, Optional


class VNFoodClassifier:
    """
    Vietnamese Food Classifier using EfficientNet-B3.
    
    Attributes:
        model_path: Path to the .pth weights file
        labels_path: Path to the labels.txt file containing class names
    """
    
    _instance = None
    _model = None
    _labels = None
    _device = None
    _transform = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VNFoodClassifier, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._device is None:
            self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            print(f"AI Predictor using device: {self._device}")
    
    def _load_labels(self, labels_path: str) -> list:
        """Load class labels from labels.txt file."""
        if not os.path.exists(labels_path):
            raise FileNotFoundError(f"Labels file not found: {labels_path}")
        
        with open(labels_path, 'r', encoding='utf-8') as f:
            labels = [line.strip() for line in f.readlines() if line.strip()]
        
        if not labels:
            raise ValueError("Labels file is empty")
        
        return labels
    
    def _build_model(self, num_classes: int) -> nn.Module:
        """
        Build EfficientNet-B3 model with custom classifier.
        
        Architecture matches training configuration:
        - Base: EfficientNet-B3 (pretrained weights NOT loaded here, we load from .pth)
        - Classifier: Dropout(0.3) -> Linear(1536, num_classes)
        """
        # Create EfficientNet-B3 without pretrained weights
        model = models.efficientnet_b3(weights=None)
        
        # Replace classifier to match training configuration
        # EfficientNet-B3 has 1536 features in the classifier
        model.classifier = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(in_features=1536, out_features=num_classes)
        )
        
        return model
    
    def _create_transforms(self) -> transforms.Compose:
        """
        Create preprocessing transforms matching training configuration.
        
        Transforms (must match training exactly):
        - Resize to (300, 300)
        - ToTensor
        - Normalize with ImageNet stats
        """
        return transforms.Compose([
            transforms.Resize((300, 300)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def load_model(
        self, 
        model_path: str = "food_model.pth",
        labels_path: str = "labels.txt"
    ) -> bool:
        """
        Load the model and labels.
        
        Args:
            model_path: Path to the .pth weights file
            labels_path: Path to labels.txt file
            
        Returns:
            True if model loaded successfully, False otherwise
        """
        if self._model is not None:
            return True
        
        try:
            # Load labels first to determine num_classes
            self._labels = self._load_labels(labels_path)
            num_classes = len(self._labels)
            print(f"Loaded {num_classes} class labels from {labels_path}")
            
            # Build model architecture
            self._model = self._build_model(num_classes)
            
            # Load weights - handle both formats
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            
            checkpoint = torch.load(model_path, map_location=self._device)
            
            # Handle different checkpoint formats
            if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
                # Checkpoint contains model_state_dict key
                state_dict = checkpoint['model_state_dict']
                print("Loading weights from checkpoint with 'model_state_dict' key")
            elif isinstance(checkpoint, dict) and 'state_dict' in checkpoint:
                # Some frameworks use 'state_dict' key
                state_dict = checkpoint['state_dict']
                print("Loading weights from checkpoint with 'state_dict' key")
            elif isinstance(checkpoint, dict):
                # Assume the dict itself is the state_dict
                state_dict = checkpoint
                print("Loading weights from direct state_dict")
            else:
                # It might be the full model (not recommended but handle it)
                raise ValueError("Unexpected checkpoint format. Expected state_dict or dict with 'model_state_dict' key.")
            
            self._model.load_state_dict(state_dict)
            self._model.to(self._device)
            self._model.eval()
            
            # Create transforms
            self._transform = self._create_transforms()
            
            print(f"AI Model loaded successfully from {model_path}")
            return True
            
        except FileNotFoundError as e:
            print(f"File not found: {e}")
            self._model = None
            self._labels = None
            return False
        except Exception as e:
            print(f"Error loading model: {e}")
            self._model = None
            self._labels = None
            return False
    
    def predict(self, image_bytes: bytes) -> Tuple[Optional[str], float]:
        """
        Predict the food class from image bytes.
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            Tuple of (label_name, confidence_score)
            Returns (None, 0.0) if prediction fails
        """
        # Ensure model is loaded
        if self._model is None:
            if not self.load_model():
                return (None, 0.0)
        
        try:
            # Load and preprocess image
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            input_tensor = self._transform(image)
            input_batch = input_tensor.unsqueeze(0).to(self._device)
            
            # Run inference
            with torch.no_grad():
                outputs = self._model(input_batch)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                confidence, predicted_idx = torch.max(probabilities, 1)
            
            # Get label and confidence
            label_idx = predicted_idx.item()
            confidence_score = confidence.item()
            
            if 0 <= label_idx < len(self._labels):
                label_name = self._labels[label_idx]
            else:
                label_name = f"Unknown (index {label_idx})"
            
            return (label_name, confidence_score)
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return (None, 0.0)
    
    def predict_from_path(self, image_path: str) -> Tuple[Optional[str], float]:
        """
        Predict the food class from an image file path.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Tuple of (label_name, confidence_score)
        """
        if not os.path.exists(image_path):
            print(f"Image file not found: {image_path}")
            return (None, 0.0)
        
        try:
            with open(image_path, 'rb') as f:
                image_bytes = f.read()
            return self.predict(image_bytes)
        except Exception as e:
            print(f"Error reading image file: {e}")
            return (None, 0.0)


# Singleton instance for use across the application
predictor = VNFoodClassifier()
