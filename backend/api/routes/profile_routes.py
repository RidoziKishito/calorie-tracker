from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import schemas, database_models
from database.db import get_db
from api import auth

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.get("", response_model=schemas.UserProfile)
async def get_profile(
    current_user: database_models.User = Depends(auth.get_current_user),
):
    """Get current user profile"""
    return schemas.UserProfile.model_validate(current_user)


@router.put("", response_model=schemas.UserProfile)
async def update_profile(
    profile_update: schemas.UserProfile,
    current_user: database_models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """Update user profile"""
    # Update user fields
    for field, value in profile_update.model_dump(exclude_unset=True).items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return schemas.UserProfile.model_validate(current_user)
