from sqlalchemy.orm import Session
from app.models.health_status import HealthStatus

class HealthRepository:
    def __init__(self, db: Session):
        self.db = db
        
    def create(self, health_status: HealthStatus):
        self.db.add(health_status)
        self.db.commit()
        self.db.refresh(health_status)
        return health_status
        
    def get_latest_by_user(self, user_id: int):
        return self.db.query(HealthStatus).filter(HealthStatus.user_id == user_id).order_by(HealthStatus.updated_at.desc()).first()
        
    def get_history_by_user(self, user_id: int):
        return self.db.query(HealthStatus).filter(HealthStatus.user_id == user_id).order_by(HealthStatus.updated_at.asc()).all()
