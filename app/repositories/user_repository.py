from sqlalchemy.orm import Session
from app.models.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, user: User):
        self.db.add(user)
        # Service layer handles commit
        return user

    def update_user(self, user: User):
        self.db.add(user)
        # Service layer handles commit
        return user

    def get_all(self, skip: int = 0, limit: int = 100):
        return self.db.query(User).offset(skip).limit(limit).all()