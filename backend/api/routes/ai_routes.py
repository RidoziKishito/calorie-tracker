from fastapi import APIRouter, UploadFile, File, Depends
from typing import Optional
import os

from models import schemas, database_models
from api import auth
from ml.food_ai import ai_model

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/analyze-food", response_model=schemas.FoodRecognitionResponse)
async def analyze_food_description(
    request: schemas.FoodRecognitionRequest,
    current_user: database_models.User = Depends(auth.get_current_user),
):
    """
    Analyze food from text description
    Uses simple AI model to predict nutritional information
    """
    if not request.food_description:
        return {
            "food_name": "Unknown",
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "portion": "N/A",
            "confidence": 0.0,
            "message": "Vui lòng nhập mô tả món ăn",
        }

    result = ai_model.analyze_food_description(request.food_description)
    return result


@router.post("/analyze-food-image", response_model=schemas.FoodRecognitionResponse)
async def analyze_food_image(
    image: UploadFile = File(...),
    current_user: database_models.User = Depends(auth.get_current_user),
):
    """
    Analyze food from image
    This is a placeholder for future AI model integration

    In production, this would:
    1. Save the uploaded image
    2. Use a CNN model to recognize food
    3. Return nutritional information
    """
    # Save uploaded file temporarily (for demo)
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, image.filename)

    with open(temp_path, "wb") as f:
        content = await image.read()
        f.write(content)

    # Use AI model to analyze
    result = ai_model.analyze_food_image(temp_path)

    # Clean up temp file
    if os.path.exists(temp_path):
        os.remove(temp_path)

    return result
