# app/services/admin_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func
import bcrypt
import logging

from app.repositories.user_repository import UserRepository
from app.repositories.food_repository import FoodRepository
from app.repositories.food_logs_repository import FoodLogRepository
from app.models.user import User, RoleEnum
from app.models.food_logs import FoodLog

logger = logging.getLogger(__name__)


class AdminService:
    """Service layer for admin operations."""

    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.food_repo = FoodRepository(db)
        self.log_repo = FoodLogRepository(db)

    def get_dashboard_stats(self) -> dict:
        """Get statistics for admin dashboard."""
        total_users = len(self.user_repo.get_all())
        total_foods = len(self.food_repo.get_all())
        total_logs = self.db.query(func.count(FoodLog.id)).scalar()

        return {
            "total_users": total_users,
            "total_foods": total_foods,
            "total_logs": total_logs,
        }

    def get_all_users(self, limit: int = 100) -> list:
        """Get all users with optional limit."""
        return self.user_repo.get_all(limit=limit)

    def get_user_by_id(self, user_id: int) -> User:
        """Get user by ID."""
        return self.user_repo.get_by_id(user_id)

    def update_user(
        self, user_id: int, full_name: str, email: str, role: str, admin_id: int = None
    ) -> User:
        """Update user information with audit logging for role changes."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return None

        old_role = user.role.value if user.role else None

        user.full_name = full_name
        user.email = email

        if role in [r.value for r in RoleEnum]:
            # Log role changes for audit trail
            if old_role != role:
                logger.warning(
                    "Role change: user_id=%s from '%s' to '%s' by admin_id=%s",
                    user_id,
                    old_role,
                    role,
                    admin_id,
                )
            user.role = RoleEnum(role)

        self.user_repo.update_user(user)
        self.db.commit()
        return user

    def reset_user_password(self, user_id: int, new_password: str) -> bool:
        """Reset user password with bcrypt hash."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return False

        user.password_hash = bcrypt.hashpw(
            new_password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        self.user_repo.update_user(user)
        self.db.commit()
        return True
