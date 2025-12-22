# app/services/food_service.py
from sqlalchemy.orm import Session
from typing import Optional, List

from app.repositories.food_repository import FoodRepository
from app.models.foods import Food


class FoodService:
    """Service layer for food operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.food_repo = FoodRepository(db)
    
    def get_all_foods(self) -> List[Food]:
        """Get all foods."""
        return self.food_repo.get_all()
    
    def get_food_by_id(self, food_id: int) -> Optional[Food]:
        """Get food by ID."""
        return self.food_repo.get_by_id(food_id)
    
    def get_food_by_ai_slug(self, ai_slug: str) -> Optional[Food]:
        """Get food by AI prediction label (slug)."""
        return self.food_repo.get_by_ai_slug(ai_slug)
    
    def create_food(
        self, 
        name: str, 
        calories: float, 
        protein: float = 0,
        carbs: float = 0,
        fat: float = 0,
        unit: str = "phần",
        ai_slug: str = None
    ) -> Food:
        """Create a new food item."""
        new_food = Food(
            name=name,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fat=fat,
            unit=unit,
            ai_slug=ai_slug
        )
        return self.food_repo.create(new_food)
    
    def update_food(
        self,
        food_id: int,
        name: str,
        calories: float,
        protein: float = 0,
        carbs: float = 0,
        fat: float = 0,
        unit: str = "phần",
        ai_slug: str = None
    ) -> Optional[Food]:
        """Update an existing food item."""
        food = self.food_repo.get_by_id(food_id)
        if not food:
            return None
        
        food.name = name
        food.calories = calories
        food.protein = protein
        food.carbs = carbs
        food.fat = fat
        food.unit = unit
        food.ai_slug = ai_slug
        
        return self.food_repo.update(food)
    
    def delete_food(self, food_id: int) -> bool:
        """Delete a food item."""
        return self.food_repo.delete(food_id)
    
    def search_foods_fts(self, query: str, user_id: int = None, limit: int = 10) -> list:
        """Search foods using full-text search."""
        return self.food_repo.search_foods_fts(query, user_id=user_id, limit=limit)
