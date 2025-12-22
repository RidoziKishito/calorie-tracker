from sqlalchemy.orm import Session
from sqlalchemy import cast, Date
from app.models.food_logs import FoodLog

class FoodLogRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, food_log: FoodLog):
        self.db.add(food_log)
        self.db.commit()
        self.db.refresh(food_log)
        return food_log

    def get_by_user_and_date(self, user_id: int, date):
        return self.db.query(FoodLog).filter(FoodLog.user_id == user_id, cast(FoodLog.eaten_at, Date) == date).all()

    def get_recent_by_user(self, user_id: int, limit: int = 10):
        return self.db.query(FoodLog).filter(FoodLog.user_id == user_id).order_by(FoodLog.created_at.desc()).limit(limit).all()

    def get_by_user_date_range(self, user_id: int, start_date, end_date):
        return self.db.query(FoodLog).filter(FoodLog.user_id == user_id, cast(FoodLog.eaten_at, Date) >= start_date, cast(FoodLog.eaten_at, Date) <= end_date).all()

    def get_by_id(self, id: int):
        return self.db.query(FoodLog).filter(FoodLog.id == id).first()

    def get_total_calories_by_date(self, user_id: int, date):
        from sqlalchemy import func
        result = self.db.query(func.sum(FoodLog.calories)).filter(
            FoodLog.user_id == user_id, 
            cast(FoodLog.eaten_at, Date) == date
        ).scalar()
        return result or 0
