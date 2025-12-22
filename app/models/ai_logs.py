# app/models/ai_logs.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class AiLog(Base):
    __tablename__ = "ai_logs"

    id = Column(Integer, primary_key=True, index=True)
    food_log_id = Column(Integer, ForeignKey("food_logs.id"), nullable=False)
    predicted_slug = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    model_version = Column(String, default="efficientnet_b0_v1")
    is_accurate = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())