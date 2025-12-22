from sqlalchemy.orm import Session
from app.models.personal_foods import PersonalFood
from typing import List

class PersonalFoodRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, personal_food: PersonalFood) -> PersonalFood:
        self.db.add(personal_food)
        self.db.commit()
        self.db.refresh(personal_food)
        return personal_food

    def get_by_user(self, user_id: int) -> List[PersonalFood]:
        return self.db.query(PersonalFood).filter(PersonalFood.user_id == user_id).order_by(PersonalFood.created_at.desc()).all()

    def get_by_id(self, id: int) -> PersonalFood:
        return self.db.query(PersonalFood).filter(PersonalFood.id == id).first()

    def update(self, personal_food: PersonalFood) -> PersonalFood:
        self.db.add(personal_food)
        self.db.commit()
        self.db.refresh(personal_food)
        return personal_food

    def delete(self, id: int) -> bool:
        food = self.get_by_id(id)
        if food:
            self.db.delete(food)
            self.db.commit()
            return True
        return False
