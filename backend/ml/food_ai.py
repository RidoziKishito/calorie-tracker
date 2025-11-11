import random


class SimpleAIModel:
    """
    Simple AI Model for food recognition
    This is a mock implementation. In production, you would use:
    - TensorFlow/Keras for deep learning
    - PyTorch for neural networks
    - OpenAI API for advanced AI
    - Custom trained models for food recognition
    """

    def __init__(self):
        # Sample food database with nutritional info
        self.food_database = {
            "cơm gà": {
                "calories": 450,
                "protein": 25,
                "carbs": 60,
                "fat": 12,
                "portion": "1 dĩa",
            },
            "phở bò": {
                "calories": 550,
                "protein": 30,
                "carbs": 70,
                "fat": 15,
                "portion": "1 tô",
            },
            "bánh mì": {
                "calories": 350,
                "protein": 15,
                "carbs": 45,
                "fat": 10,
                "portion": "1 ổ",
            },
            "bún chả": {
                "calories": 480,
                "protein": 28,
                "carbs": 55,
                "fat": 18,
                "portion": "1 phần",
            },
            "gỏi cuốn": {
                "calories": 200,
                "protein": 12,
                "carbs": 30,
                "fat": 5,
                "portion": "3 cuốn",
            },
            "cà phê sữa": {
                "calories": 180,
                "protein": 5,
                "carbs": 25,
                "fat": 8,
                "portion": "1 ly",
            },
            "trà sữa": {
                "calories": 350,
                "protein": 8,
                "carbs": 60,
                "fat": 12,
                "portion": "1 ly",
            },
            "cơm sườn": {
                "calories": 520,
                "protein": 22,
                "carbs": 65,
                "fat": 20,
                "portion": "1 dĩa",
            },
            "pizza": {
                "calories": 650,
                "protein": 25,
                "carbs": 70,
                "fat": 28,
                "portion": "3 miếng",
            },
            "burger": {
                "calories": 580,
                "protein": 30,
                "carbs": 50,
                "fat": 28,
                "portion": "1 chiếc",
            },
            "salad": {
                "calories": 150,
                "protein": 8,
                "carbs": 15,
                "fat": 7,
                "portion": "1 chén",
            },
            "trứng chiên": {
                "calories": 180,
                "protein": 12,
                "carbs": 2,
                "fat": 14,
                "portion": "2 quả",
            },
            "chuối": {
                "calories": 105,
                "protein": 1,
                "carbs": 27,
                "fat": 0,
                "portion": "1 quả",
            },
            "táo": {
                "calories": 95,
                "protein": 0,
                "carbs": 25,
                "fat": 0,
                "portion": "1 quả",
            },
        }

    def analyze_food_description(self, description: str) -> dict:
        """
        Analyze food description and return nutritional info
        This simulates AI processing
        """
        description_lower = description.lower().strip()

        # Try to find exact match
        if description_lower in self.food_database:
            info = self.food_database[description_lower]
            return {
                "food_name": description,
                "calories": info["calories"],
                "protein": info["protein"],
                "carbs": info["carbs"],
                "fat": info["fat"],
                "portion": info["portion"],
                "confidence": 0.95,
                "message": "Tìm thấy thông tin chính xác",
            }

        # Try to find partial match
        for food_name, info in self.food_database.items():
            if description_lower in food_name or food_name in description_lower:
                return {
                    "food_name": food_name.title(),
                    "calories": info["calories"],
                    "protein": info["protein"],
                    "carbs": info["carbs"],
                    "fat": info["fat"],
                    "portion": info["portion"],
                    "confidence": 0.78,
                    "message": f"Tìm thấy món tương tự: {food_name}",
                }

        # If no match found, return estimated values
        return {
            "food_name": description,
            "calories": random.randint(200, 600),
            "protein": random.randint(10, 30),
            "carbs": random.randint(30, 70),
            "fat": random.randint(5, 25),
            "portion": "1 phần",
            "confidence": 0.45,
            "message": "Không tìm thấy trong database. Đây là ước tính.",
        }

    def analyze_food_image(self, image_path: str) -> dict:
        """
        Analyze food image and return nutritional info
        This is a placeholder for future AI model integration

        In production, you would:
        1. Load the image using PIL/OpenCV
        2. Preprocess the image
        3. Use a trained CNN model (like ResNet, EfficientNet)
        4. Predict food category
        5. Return nutritional info from database
        """
        # For now, return a random food from database
        food_name = random.choice(list(self.food_database.keys()))
        info = self.food_database[food_name]

        return {
            "food_name": food_name.title(),
            "calories": info["calories"],
            "protein": info["protein"],
            "carbs": info["carbs"],
            "fat": info["fat"],
            "portion": info["portion"],
            "confidence": 0.72,
            "message": "Nhận diện từ ảnh (demo). Trong production sẽ dùng AI model thật.",
        }


# Create singleton instance
ai_model = SimpleAIModel()
