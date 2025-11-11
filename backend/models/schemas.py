from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ============ User Models ============
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(UserBase):
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activityLevel: Optional[str] = None
    goal: Optional[str] = None
    dailyCalories: Optional[int] = 2000

    class Config:
        from_attributes = True


class User(UserProfile):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Food Log Models ============
class FoodLogBase(BaseModel):
    name: str
    calories: int
    protein: int
    carbs: int
    fat: int
    portion: str
    mealType: str


class FoodLogCreate(FoodLogBase):
    imageUrl: Optional[str] = None


class FoodLog(FoodLogBase):
    id: int
    user_id: int
    timestamp: datetime
    imageUrl: Optional[str] = None

    class Config:
        from_attributes = True


# ============ Authentication Models ============
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserProfile


class TokenData(BaseModel):
    email: Optional[str] = None


# ============ AI Models ============
class FoodRecognitionRequest(BaseModel):
    food_description: Optional[str] = None


class FoodRecognitionResponse(BaseModel):
    food_name: str
    calories: int
    protein: int
    carbs: int
    fat: int
    portion: str
    confidence: float
    message: str
