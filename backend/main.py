from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from database.db import create_tables
from api.routes import auth_routes, profile_routes, food_routes, ai_routes

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="CalorieTracker API",
    description="API for CalorieTracker - A smart nutrition tracking app with AI",
    version="1.0.0",
)

# CORS Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()
    print("✅ Database tables created successfully!")
    print(f"✅ Server is running!")
    print(f"📚 API Documentation: http://localhost:8000/docs")
    print(f"🌐 Frontend URL: {FRONTEND_URL}")


# Include routers
app.include_router(auth_routes.router)
app.include_router(profile_routes.router)
app.include_router(food_routes.router)
app.include_router(ai_routes.router)


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to CalorieTracker API!",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "features": [
            "Authentication with JWT",
            "User Profile Management",
            "Food Logging",
            "AI Food Recognition (Simple Demo)",
        ],
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected", "ai_model": "loaded"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
