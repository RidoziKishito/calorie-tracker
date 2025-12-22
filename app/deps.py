from fastapi import Header, HTTPException, Depends, Request
from typing import Annotated
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.user_repository import UserRepository
from app.repositories.food_logs_repository import FoodLogRepository
from app.repositories.health_repository import HealthRepository
from app.repositories.personal_food_repository import PersonalFoodRepository
from app.repositories.food_repository import FoodRepository
from app.services.auth_service import AuthService
from app.services.food_logs_service import FoodLogService
from app.services.personal_food_service import PersonalFoodService
from app.services.admin_service import AdminService
from app.services.food_service import FoodService


from app.core.security import decode_token

async def get_optional_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        return None
    
    payload = decode_token(token)
    if not payload:
        return None
        
    user_id = payload.get("sub")
    if not user_id:
        return None
    
    user_repo = UserRepository(db)
    try:
        user = user_repo.get_by_id(int(user_id))
        return user
    except (ValueError, TypeError):
        return None

async def get_admin_user(request: Request, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(status_code=303, headers={"Location": "/account/login"})
    
    payload = decode_token(token)
    if not payload:
         raise HTTPException(status_code=303, headers={"Location": "/account/login"})

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=303, headers={"Location": "/account/login"})
        
    user = user_repo.get_by_id(int(user_id))
    if not user or user.role.value != "admin":
        raise HTTPException(status_code=303, headers={"Location": "/home/dashboard"})
    
    return user


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    repo = UserRepository(db)
    health_repo = HealthRepository(db)
    return AuthService(repo, health_repo)

def get_food_log_service(db: Session = Depends(get_db)) -> FoodLogService:
    repo = FoodLogRepository(db)
    return FoodLogService(repo)

def get_health_repository(db: Session = Depends(get_db)) -> HealthRepository:
    return HealthRepository(db)

def get_personal_food_service(db: Session = Depends(get_db)) -> PersonalFoodService:
    repo = PersonalFoodRepository(db)
    return PersonalFoodService(repo)

def get_food_repository(db: Session = Depends(get_db)) -> FoodRepository:
    return FoodRepository(db)

def get_admin_service(db: Session = Depends(get_db)) -> AdminService:
    return AdminService(db)

def get_food_service(db: Session = Depends(get_db)) -> FoodService:
    return FoodService(db)