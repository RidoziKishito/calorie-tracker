# app/repositories/food_repository.py
from sqlalchemy.orm import Session
from app.models.foods import Food
from typing import Optional, List


class FoodRepository:
    """Repository for querying foods from the database."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, food_id: int) -> Optional[Food]:
        """Get food by ID."""
        return self.db.query(Food).filter(Food.id == food_id).first()
    
    def get_by_ai_slug(self, ai_slug: str) -> Optional[Food]:
        """
        Get food by AI slug (used for matching AI predictions to database entries).
        
        Args:
            ai_slug: The predicted label from the AI model
            
        Returns:
            Food object if found, None otherwise
        """
        return self.db.query(Food).filter(Food.ai_slug == ai_slug).first()
    
    def get_all(self) -> List[Food]:
        """Get all foods."""
        return self.db.query(Food).all()
    
    def search_by_name(self, name: str) -> List[Food]:
        """Search foods by name (case-insensitive partial match)."""
        return self.db.query(Food).filter(Food.name.ilike(f"%{name}%")).all()

    def create(self, food: Food):
        self.db.add(food)
        self.db.commit()
        self.db.refresh(food)
        return food

    def update(self, food: Food):
        self.db.add(food)
        self.db.commit()
        self.db.refresh(food)
        return food

    def delete(self, food_id: int):
        food = self.get_by_id(food_id)
        if food:
            self.db.delete(food)
            self.db.commit()
            return True
        return False
    
    def search_foods_fts(self, query: str, user_id: int = None, limit: int = 10):
        """
        Search foods using Full-Text Search across both personal_foods and public foods tables.
        Personal foods for the user appear first in results.
        
        Args:
            query: Search query string
            user_id: Optional user ID to prioritize personal foods
            limit: Maximum number of results to return
            
        Returns:
            List of tuples (food_dict, is_personal: bool)
        """
        from sqlalchemy import text
        
        results = []
        fts_query = query.strip().replace(" ", " & ")
        
        if user_id:
            personal_query = text("""
                SELECT id, name, unit, calories, carbs, protein, fat
                FROM personal_foods
                WHERE user_id = :user_id 
                AND fts_vector @@ to_tsquery('simple', fn_remove_accents_immutable(:query) || ':*')
                ORDER BY name
                LIMIT :limit
            """)
            personal_results = self.db.execute(
                personal_query, 
                {"user_id": user_id, "query": fts_query, "limit": min(limit, 5)}
            ).fetchall()
            for row in personal_results:
                results.append(self._map_row(row, True))

        remaining_limit = limit - len(results)
        if remaining_limit > 0:
            public_query = text("""
                SELECT id, name, unit, calories, carbs, protein, fat
                FROM foods
                WHERE fts_vector @@ to_tsquery('simple', fn_remove_accents_immutable(:query) || ':*')
                ORDER BY name
                LIMIT :limit
            """)
            public_results = self.db.execute(
                public_query,
                {"query": fts_query, "limit": remaining_limit}
            ).fetchall()
            for row in public_results:
                results.append(self._map_row(row, False))
        
        return results

    def _map_row(self, row, is_personal: bool):
        return {
            "id": row[0],
            "name": row[1],
            "unit": row[2],
            "calories": row[3],
            "carbs": float(row[4]) if row[4] else 0,
            "protein": float(row[5]) if row[5] else 0,
            "fat": float(row[6]) if row[6] else 0,
            "is_personal": is_personal
        }
