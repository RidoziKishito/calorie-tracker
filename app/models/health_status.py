from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class ActivityLevelEnum(str, enum.Enum):
    Sedentary = "Sedentary"
    Light = "Light"
    Moderate = "Moderate"
    Active = "Active"
    VeryActive = "Very Active"

class HealthStatus(Base):
    __tablename__ = "health_status"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Changed to Float as requested to avoid Numeric overflow
    weight_kg = Column(Float, nullable=False)
    height_cm = Column(Float, nullable=False)
    bmi = Column(Float, nullable=True)
    tdee = Column(Float, nullable=True)
    
    activity_level = Column(Enum(ActivityLevelEnum), default=ActivityLevelEnum.Sedentary)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to User
    user = relationship("User", back_populates="_health_history")