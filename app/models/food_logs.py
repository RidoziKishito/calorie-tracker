# app/models/food_logs.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, CheckConstraint
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class MealTypeEnum(enum.Enum):
    Breakfast = "Breakfast"
    Lunch = "Lunch"
    Dinner = "Dinner"
    Snack = "Snack"

class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_id = Column(Integer, ForeignKey("foods.id"), nullable=True)
    personal_food_id = Column(Integer, ForeignKey("personal_foods.id"), nullable=True)
    image_url = Column(String, nullable=True)
    final_food_name = Column(String, nullable=False)
    calories = Column(Integer, nullable=False)
    carbs = Column(Float, nullable=True, default=0)
    protein = Column(Float, nullable=True, default=0)
    fat = Column(Float, nullable=True, default=0)
    meal_type = Column(Enum(MealTypeEnum), default=MealTypeEnum.Breakfast)
    eaten_at = Column(DateTime(timezone=True), default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    from sqlalchemy.orm import relationship
    personal_food = relationship("PersonalFood")
    food = relationship("Food")

    __table_args__ = (
        CheckConstraint(
            "((food_id IS NOT NULL AND personal_food_id IS NULL) OR "
            "(food_id IS NULL AND personal_food_id IS NOT NULL) OR "
            "(food_id IS NULL AND personal_food_id IS NULL))",
            name="check_food_source"
        ),
    )