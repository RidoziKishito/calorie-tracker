# app/models/foods.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ai_slug = Column(String, nullable=True, unique=True)
    unit = Column(String, default="suất")
    calories = Column(Integer, nullable=False)
    carbs = Column(Float, default=0)
    protein = Column(Float, default=0)
    fat = Column(Float, default=0)
    origin_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # Note: fts_vector is a server-generated column, not mapped in SQLAlchemy