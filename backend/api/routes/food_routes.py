from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import schemas, database_models
from database.db import get_db
from api import auth

router = APIRouter(prefix="/api/food", tags=["Food Logs"])


@router.get("/logs", response_model=List[schemas.FoodLog])
async def get_food_logs(
    current_user: database_models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """Get all food logs for current user"""
    logs = (
        db.query(database_models.FoodLog)
        .filter(database_models.FoodLog.user_id == current_user.id)
        .order_by(database_models.FoodLog.timestamp.desc())
        .all()
    )
    return logs


@router.post("/log", response_model=schemas.FoodLog)
async def add_food_log(
    log_data: schemas.FoodLogCreate,
    current_user: database_models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new food log"""
    db_log = database_models.FoodLog(**log_data.model_dump(), user_id=current_user.id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@router.delete("/log/{log_id}")
async def delete_food_log(
    log_id: int,
    current_user: database_models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a food log"""
    log = (
        db.query(database_models.FoodLog)
        .filter(
            database_models.FoodLog.id == log_id,
            database_models.FoodLog.user_id == current_user.id,
        )
        .first()
    )

    if not log:
        raise HTTPException(status_code=404, detail="Food log not found")

    db.delete(log)
    db.commit()
    return {"message": "Food log deleted successfully"}


@router.put("/log/{log_id}", response_model=schemas.FoodLog)
async def update_food_log(
    log_id: int,
    log_update: schemas.FoodLogCreate,
    current_user: database_models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """Update a food log"""
    log = (
        db.query(database_models.FoodLog)
        .filter(
            database_models.FoodLog.id == log_id,
            database_models.FoodLog.user_id == current_user.id,
        )
        .first()
    )

    if not log:
        raise HTTPException(status_code=404, detail="Food log not found")

    for field, value in log_update.model_dump(exclude_unset=True).items():
        setattr(log, field, value)

    db.commit()
    db.refresh(log)
    return log
