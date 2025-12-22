# app/models/personal_foods.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum, FetchedValue
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class ApprovalStatusEnum(str, enum.Enum):
    Draft = "Draft"
    Pending = "Pending"
    Approved = "Approved"
    Rejected = "Rejected"

class PersonalFood(Base):
    __tablename__ = "personal_foods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    unit = Column(String, default="phần")
    calories = Column(Integer, nullable=False)
    carbs = Column(Float, default=0)
    protein = Column(Float, default=0)
    fat = Column(Float, default=0)
    approval_status = Column(Enum(ApprovalStatusEnum), default=ApprovalStatusEnum.Draft)
    admin_feedback = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Marked as FetchedValue so SQLAlchemy knows it is server-generated (Computed)
    # and should not be included in INSERT/UPDATE statements.
    fts_vector = Column(Text, server_default=FetchedValue(), nullable=True) 