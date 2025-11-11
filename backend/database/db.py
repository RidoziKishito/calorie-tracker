from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

# Load environment variables (.env should contain DATABASE_URL pointing to Supabase Postgres)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Fallback to local sqlite for dev if not provided
    DATABASE_URL = "sqlite:///./calorie_tracker.db"

# Normalize Postgres URL for SQLAlchemy psycopg3 dialect if using Supabase
# SQLAlchemy recommends explicit dialect+driver: postgresql+psycopg://...
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

# Supabase Postgres connection notes:
# Raw Supabase URL example:
# postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres
# Pooler example:
# postgresql://<user>:<password>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=(
        {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
    ),
)


class Base(DeclarativeBase):
    pass


SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create tables only when using local sqlite.
    For Supabase, we apply schema manually via SQL file."""
    if DATABASE_URL.startswith("sqlite"):
        Base.metadata.create_all(bind=engine)
