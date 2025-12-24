import base64
import logging

from fastapi import APIRouter, Request, UploadFile, File, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse

from app.core.ai_predictor import predictor
from app.deps import get_optional_user, get_food_service
from app.services.food_service import FoodService
from app.services.cloudinary_service import CloudinaryService

router = APIRouter(prefix="/camera", tags=["Camera"])
templates = Jinja2Templates(directory="app/templates")
logger = logging.getLogger(__name__)


@router.get("/scan")
async def camera_scan_page(request: Request, user=Depends(get_optional_user)):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)
    return templates.TemplateResponse(
        "camera_scan.html", {"request": request, "user": user}
    )


@router.get("/result")
async def camera_result_page(
    request: Request, result: str = "", user=Depends(get_optional_user)
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)
    return templates.TemplateResponse(
        "your_meal.html",
        {
            "request": request,
            "user": user,
            "predicted_food": result,
            "food": None,
            "confidence": 0,
            "not_found": False,
        },
    )


@router.post("/result")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    user=Depends(get_optional_user),
    food_service: FoodService = Depends(get_food_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    predicted_label = None
    confidence = 0.0
    food = None
    not_found = False
    image_data = None
    image_url = None

    try:
        # Read image content
        content = await file.read()

        # Upload to Cloudinary
        image_url = CloudinaryService.upload_image(
            content, folder="nutrition_tracker/food_logs"
        )

        # Encode image for display in template
        image_data = base64.b64encode(content).decode("utf-8")

        # Get prediction from AI model
        predicted_label, confidence = predictor.predict(content)

        if predicted_label:
            # Use service to get food by AI slug
            food = food_service.get_food_by_ai_slug(predicted_label)

            if food is None:
                not_found = True
                logger.debug(
                    "Food not found in database for ai_slug: %s", predicted_label
                )
        else:
            not_found = True
            logger.debug("AI prediction returned None")

    except Exception as e:
        logger.error("Prediction error occurred", exc_info=True)
        not_found = True

    return templates.TemplateResponse(
        "your_meal.html",
        {
            "request": request,
            "user": user,
            "predicted_food": predicted_label or "Không nhận diện được",
            "food": food,
            "confidence": round(confidence * 100, 1),
            "not_found": not_found,
            "image_uploaded": True,
            "image_data": image_data,
            "image_url": image_url,
        },
    )


@router.get("/search_food")
async def search_food(
    request: Request,
    q: str = "",
    user=Depends(get_optional_user),
    food_service: FoodService = Depends(get_food_service),
):
    """
    Search for foods using FTS. Returns JSON list of matching foods.
    Personal foods appear first.
    """
    if not user:
        return {"results": []}

    if not q or len(q) < 2:
        return {"results": []}

    results = food_service.search_foods_fts(q, user_id=user.id, limit=10)

    return {"results": results}
