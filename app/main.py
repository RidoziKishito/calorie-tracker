import os
import sys
import logging

# Ensure the parent directory is in sys.path so 'app' module can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
import uvicorn

from app.core.database import engine, Base
from app.routers import auth_router, home_router, camera_router
from app.routers.admin_router import router as admin_router

load_dotenv()

# Basic logging configuration
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

tags_metadata = [
    {"name": "Authentication", "description": "Đăng nhập, đăng ký, OAuth"},
    {"name": "Home", "description": "Dashboard, nhật ký, hồ sơ người dùng"},
    {"name": "Camera", "description": "Quét và nhận diện thực phẩm"},
    {"name": "Admin", "description": "Quản trị hệ thống (yêu cầu quyền admin)"},
]

app = FastAPI(
    title="Nutrition Tracker API",
    description="API theo dõi dinh dưỡng và calories hàng ngày",
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Session middleware for OAuth
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production"),
)

# Static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Routers
app.include_router(auth_router)
app.include_router(home_router)
app.include_router(camera_router)
app.include_router(admin_router)


@app.get("/", include_in_schema=False)
async def root():
    """Redirect root to welcome page"""
    return RedirectResponse(url="/welcome")


if __name__ == "__main__":
    logging.getLogger(__name__).info("Server is starting...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
