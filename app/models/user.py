# app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Date, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class GenderEnum(enum.Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"

class RoleEnum(enum.Enum):
    user = "user"
    admin = "admin"
    moderator = "moderator"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.user)
    dob = Column(Date, nullable=False)
    gender = Column(Enum(GenderEnum), default=GenderEnum.Male)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    avatar_url = Column(String, nullable=True)

    # Relationship to HealthStatus (One-to-One)
    # Relationship to HealthStatus (History)
    _health_history = relationship("HealthStatus", back_populates="user", cascade="all, delete-orphan")

    @property
    def health_status(self):
        if not self._health_history:
            return None
        # Return latest
        return sorted(self._health_history, key=lambda x: x.updated_at or x.id, reverse=True)[0]