from app.repositories.personal_food_repository import PersonalFoodRepository
from app.models.personal_foods import PersonalFood

class PersonalFoodService:
    def __init__(self, repo: PersonalFoodRepository):
        self.repo = repo

    def create_personal_food(self, user_id: int, name: str, calories: float, 
                             carbs: float, protein: float, fat: float, unit: str = "portion"):
        
        food = PersonalFood(
            user_id=user_id,
            name=name,
            calories=int(round(calories)),
            carbs=carbs,
            protein=protein,
            fat=fat,
            unit=unit
        )
        return self.repo.create(food)

    def get_personal_foods(self, user_id: int):
        return self.repo.get_by_user(user_id)
    
    def get_food_by_id(self, id: int):
        return self.repo.get_by_id(id)

    def update_personal_food(self, food_id: int, name: str, calories: float,
                            carbs: float, protein: float, fat: float, unit: str):
        food = self.repo.get_by_id(food_id)
        if not food:
            return None
        
        food.name = name
        food.calories = int(round(calories))
        food.carbs = carbs
        food.protein = protein
        food.fat = fat
        food.unit = unit
        
        return self.repo.update(food)
    
    def delete_personal_food(self, food_id: int):
        return self.repo.delete(food_id)
