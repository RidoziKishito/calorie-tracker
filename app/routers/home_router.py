from collections import Counter
from datetime import date, timedelta, datetime
from typing import Optional

from fastapi import (
    APIRouter,
    Request,
    Depends,
    Form,
    Query,
    UploadFile,
    File,
    HTTPException,
    status,
)
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse

from app.deps import (
    get_optional_user,
    get_food_log_service,
    get_health_repository,
    get_auth_service,
    get_personal_food_service,
)
from app.services.food_logs_service import FoodLogService
from app.services.personal_food_service import PersonalFoodService
from app.services.cloudinary_service import CloudinaryService
from app.repositories.health_repository import HealthRepository

router = APIRouter(prefix="/home", tags=["Home"])
templates = Jinja2Templates(directory="app/templates")

# --- File upload validation helpers ---
ALLOWED_EXTS = {"jpg", "jpeg", "png", "gif"}
ALLOWED_MIME = {"image/jpeg", "image/png", "image/gif"}
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5MB


def _is_allowed_extension(filename: str) -> bool:
    if not filename or "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[-1].lower()
    return ext in ALLOWED_EXTS


def _has_allowed_mime(content_type: str) -> bool:
    return (content_type or "").lower() in ALLOWED_MIME


def _matches_magic_bytes(data: bytes) -> bool:
    if not data or len(data) < 4:
        return False
    # JPEG: FF D8 FF
    if data[:3] == b"\xff\xd8\xff":
        return True
    # PNG: 89 50 4E 47 0D 0A 1A 0A
    if len(data) >= 8 and data[:8] == b"\x89PNG\r\n\x1a\n":
        return True
    # GIF: GIF87a or GIF89a
    if len(data) >= 6 and data[:6] in (b"GIF87a", b"GIF89a"):
        return True
    return False


@router.get("/meals")
async def meals_page(
    request: Request,
    user=Depends(get_optional_user),
    personal_food_service: PersonalFoodService = Depends(get_personal_food_service),
    food_log_service: FoodLogService = Depends(get_food_log_service),
    health_repo: HealthRepository = Depends(get_health_repository),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    personal_foods = personal_food_service.get_personal_foods(user.id)
    weight_history = health_repo.get_history_by_user(user.id)

    # Format data for Chart.js
    dates = [
        entry.updated_at.strftime("%d/%m") if entry.updated_at else ""
        for entry in weight_history
    ]
    weights = [entry.weight_kg for entry in weight_history]

    return templates.TemplateResponse(
        "meals.html",
        {
            "request": request,
            "user": user,
            "personal_foods": personal_foods,
            "dates": dates,
            "weights": weights,
        },
    )


@router.get("/dashboard")
async def dashboard(
    request: Request,
    user=Depends(get_optional_user),
    food_log_service: FoodLogService = Depends(get_food_log_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    today = date.today()
    yesterday = today - timedelta(days=1)
    recent_food_logs = food_log_service.get_recent_food_logs(user.id, 5)

    # Calculate daily calories using service method (queries DB for sum)
    daily_calories = food_log_service.get_total_calories_for_date(user.id, today)

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "user": user,
            "recent_meals": recent_food_logs,
            "daily_calories": daily_calories,
            "today": today,
            "yesterday": yesterday,
        },
    )


@router.get("/manual_input")
async def manual_input_page(
    request: Request,
    user=Depends(get_optional_user),
    personal_food_service: PersonalFoodService = Depends(get_personal_food_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    personal_foods = personal_food_service.get_personal_foods(user.id)

    return templates.TemplateResponse(
        "manual_input.html",
        {"request": request, "user": user, "personal_foods": personal_foods},
    )


@router.post("/manual_input")
async def add_manual_meal(
    request: Request,
    name: str = Form(None),
    calories: float = Form(None),
    protein: float = Form(0),
    carbs: float = Form(0),
    fat: float = Form(0),
    meal_type: str = Form("Snack"),
    portion: str = Form("medium"),
    personal_food_id: int = Form(None),
    user=Depends(get_optional_user),
    food_log_service: FoodLogService = Depends(get_food_log_service),
    personal_food_service: PersonalFoodService = Depends(get_personal_food_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    final_name = name
    final_calories = calories

    if personal_food_id:
        p_food = personal_food_service.get_food_by_id(personal_food_id)
        if p_food:
            final_name = p_food.name
            final_calories = p_food.calories
            protein = p_food.protein
            carbs = p_food.carbs
            fat = p_food.fat

    if not final_name or final_calories is None:
        return RedirectResponse(url="/home/manual_input", status_code=303)

    food_log_service.add_food_log(
        user.id, final_name, final_calories, carbs, protein, fat, meal_type
    )
    return RedirectResponse(url="/home/dashboard", status_code=303)


@router.get("/update_health")
async def update_health_page(request: Request, user=Depends(get_optional_user)):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)
    return templates.TemplateResponse(
        "update_health.html", {"request": request, "user": user}
    )


@router.post("/update_health")
async def update_health(
    request: Request,
    weight_kg: float = Form(...),
    height_cm: float = Form(...),
    user=Depends(get_optional_user),
    auth_service=Depends(get_auth_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    try:
        auth_service.update_health(user.id, weight_kg, height_cm)
        return RedirectResponse(url="/home/profile", status_code=303)
    except ValueError as e:
        return templates.TemplateResponse(
            "update_health.html", {"request": request, "user": user, "error": str(e)}
        )


@router.get("/diary")
async def diary(
    request: Request,
    date: Optional[str] = None,
    user=Depends(get_optional_user),
    food_log_service: FoodLogService = Depends(get_food_log_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    if date:
        try:
            selected_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            selected_date = datetime.now().date()
    else:
        selected_date = datetime.now().date()

    # Load food logs for the selected date
    food_logs = food_log_service.get_food_logs_by_date(user.id, selected_date)

    # Group by meal type
    meals = {"Breakfast": [], "Lunch": [], "Dinner": [], "Snack": []}
    total_calories = 0
    for log in food_logs:
        meals[log.meal_type.value].append(log)
        total_calories += log.calories

    return templates.TemplateResponse(
        "diary.html",
        {
            "request": request,
            "user": user,
            "selected_date": selected_date,
            "prev_date": selected_date - timedelta(days=1),
            "next_date": selected_date + timedelta(days=1),
            "meals": meals,
            "total_calories": total_calories,
        },
    )


@router.post("/diary/add")
async def add_to_diary_from_camera(
    request: Request,
    food_id: Optional[int] = Form(None),  # Made optional to support personal foods
    personal_food_id: Optional[int] = Form(None),  # Added for personal food support
    food_name: str = Form(...),
    calories: float = Form(...),
    carbs: float = Form(0),
    protein: float = Form(0),
    fat: float = Form(0),
    meal_type: str = Form("Snack"),
    portion: float = Form(1.0),
    image_url: Optional[str] = Form(None),
    user=Depends(get_optional_user),
    food_log_service: FoodLogService = Depends(get_food_log_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    # Multiply nutrition values by portion
    final_calories = calories * portion
    final_carbs = carbs * portion
    final_protein = protein * portion
    final_fat = fat * portion

    # Add to food logs
    food_log_service.add_food_log(
        user_id=user.id,
        final_food_name=food_name,
        calories=final_calories,
        carbs=final_carbs,
        protein=final_protein,
        fat=final_fat,
        meal_type=meal_type,
        food_id=food_id,
        personal_food_id=personal_food_id,
        image_url=image_url,
    )

    return RedirectResponse(url="/home/diary", status_code=303)


@router.get("/meals/create")
async def create_meal_page(request: Request, user=Depends(get_optional_user)):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)
    return templates.TemplateResponse(
        "create_meal.html", {"request": request, "user": user}
    )


@router.post("/meals/create")
async def create_meal(
    request: Request,
    name: str = Form(...),
    calories: int = Form(...),
    carbs: float = Form(0),
    protein: float = Form(0),
    fat: float = Form(0),
    unit: str = Form("phần"),
    user=Depends(get_optional_user),
    personal_food_service: PersonalFoodService = Depends(get_personal_food_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    personal_food_service.create_personal_food(
        user_id=user.id,
        name=name,
        calories=calories,
        carbs=carbs,
        protein=protein,
        fat=fat,
        unit=unit,
    )

    return RedirectResponse(url="/home/meals", status_code=303)


@router.get("/meals/personal/edit/{id}")
async def edit_personal_food_page(
    request: Request,
    id: int,
    user=Depends(get_optional_user),
    personal_food_service: PersonalFoodService = Depends(get_personal_food_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    food = personal_food_service.get_food_by_id(id)
    if not food or food.user_id != user.id:
        return RedirectResponse(url="/home/meals", status_code=303)

    return templates.TemplateResponse(
        "edit_meal.html", {"request": request, "user": user, "food": food}
    )


@router.post("/meals/personal/update")
async def update_personal_food(
    request: Request,
    id: int = Form(...),
    name: str = Form(...),
    calories: float = Form(...),
    carbs: float = Form(0),
    protein: float = Form(0),
    fat: float = Form(0),
    unit: str = Form("portion"),
    user=Depends(get_optional_user),
    personal_food_service: PersonalFoodService = Depends(get_personal_food_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    food = personal_food_service.get_food_by_id(id)
    if not food or food.user_id != user.id:
        return RedirectResponse(url="/home/meals", status_code=303)

    personal_food_service.update_personal_food(
        food_id=id,
        name=name,
        calories=calories,
        carbs=carbs,
        protein=protein,
        fat=fat,
        unit=unit,
    )

    return RedirectResponse(url="/home/meals", status_code=303)


@router.post("/meals/personal/delete/{id}")
async def delete_personal_food(
    request: Request,
    id: int,
    user=Depends(get_optional_user),
    personal_food_service: PersonalFoodService = Depends(get_personal_food_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    food = personal_food_service.get_food_by_id(id)
    if not food or food.user_id != user.id:
        return RedirectResponse(url="/home/meals", status_code=303)

    personal_food_service.delete_personal_food(id)
    return RedirectResponse(url="/home/meals", status_code=303)


@router.get("/meals/detail")
async def meal_detail(
    request: Request,
    id: int = Query(...),
    user=Depends(get_optional_user),
    food_log_service: FoodLogService = Depends(get_food_log_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)
    food_log = food_log_service.get_food_log_by_id_for_user(id, user.id)
    if not food_log:
        raise HTTPException(status_code=404)
    return templates.TemplateResponse(
        "meal_detail.html", {"request": request, "user": user, "food_log": food_log}
    )


@router.post("/meals/update")
async def update_meal(
    request: Request,
    id: int = Form(...),
    final_food_name: str = Form(...),
    calories: float = Form(...),
    carbs: float = Form(0),
    protein: float = Form(0),
    fat: float = Form(0),
    meal_type: str = Form("Snack"),
    user=Depends(get_optional_user),
    food_log_service: FoodLogService = Depends(get_food_log_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)
    food_log = food_log_service.get_food_log_by_id_for_user(id, user.id)
    if not food_log:
        raise HTTPException(status_code=404)

    food_log.final_food_name = final_food_name
    food_log.calories = calories
    food_log.carbs = carbs
    food_log.protein = protein
    food_log.fat = fat
    food_log.meal_type = meal_type
    food_log_service.repo.db.commit()
    return RedirectResponse(url="/home/diary", status_code=303)


@router.post("/meals/report")
async def report_meal(
    request: Request,
    id: int = Form(...),
    correct_name: str = Form(...),
    user=Depends(get_optional_user),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)
    # Log the report for later review - future feature
    print(
        f"Meal report from user {user.id} - Meal ID: {id}, Suggested name: {correct_name}"
    )
    return RedirectResponse(url="/home/diary", status_code=303)


@router.get("/profile")
async def profile(
    request: Request,
    user=Depends(get_optional_user),
    food_log_service: FoodLogService = Depends(get_food_log_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    avg_macros = food_log_service.get_average_macros(user.id)

    return templates.TemplateResponse(
        "profile.html", {"request": request, "user": user, "avg_macros": avg_macros}
    )


@router.post("/profile/change_password")
async def change_password(
    request: Request,
    old_password: str = Form(...),
    new_password: str = Form(...),
    confirm_password: str = Form(...),
    user=Depends(get_optional_user),
    auth_service=Depends(get_auth_service),
    food_log_service: FoodLogService = Depends(get_food_log_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    # Validate passwords match
    if new_password != confirm_password:
        avg_macros = food_log_service.get_average_macros(user.id)
        return templates.TemplateResponse(
            "profile.html",
            {
                "request": request,
                "user": user,
                "avg_macros": avg_macros,
                "password_error": "Mật khẩu mới không khớp!",
            },
        )

    try:
        success = auth_service.change_password(user.id, old_password, new_password)
        if not success:
            avg_macros = food_log_service.get_average_macros(user.id)
            return templates.TemplateResponse(
                "profile.html",
                {
                    "request": request,
                    "user": user,
                    "avg_macros": avg_macros,
                    "password_error": "Mật khẩu cũ không đúng!",
                },
            )

        # Success - redirect with success message
        avg_macros = food_log_service.get_average_macros(user.id)
        return templates.TemplateResponse(
            "profile.html",
            {
                "request": request,
                "user": user,
                "avg_macros": avg_macros,
                "password_success": "Đổi mật khẩu thành công!",
            },
        )

    except ValueError as e:
        avg_macros = food_log_service.get_average_macros(user.id)
        return templates.TemplateResponse(
            "profile.html",
            {
                "request": request,
                "user": user,
                "avg_macros": avg_macros,
                "password_error": str(e),
            },
        )


@router.post("/profile/upload_avatar")
async def upload_avatar(
    request: Request,
    file: UploadFile = File(...),
    user=Depends(get_optional_user),
    auth_service=Depends(get_auth_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    # --- Validation before upload ---
    if not _is_allowed_extension(file.filename or ""):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file extension"
        )

    if not _has_allowed_mime(file.content_type or ""):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid content type"
        )

    data = await file.read()
    if len(data) == 0 or len(data) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file size"
        )

    if not _matches_magic_bytes(data[:32]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image signature"
        )

    # Upload to Cloudinary only after validation passes
    image_url = CloudinaryService.upload_image(data, folder="nutrition_tracker/avatars")

    if image_url:
        auth_service.update_avatar(user.id, image_url)

    return RedirectResponse(url="/home/profile", status_code=303)


@router.post("/profile/update")
async def update_profile_info(
    request: Request,
    full_name: str = Form(...),
    user=Depends(get_optional_user),
    auth_service=Depends(get_auth_service),
    food_log_service: FoodLogService = Depends(get_food_log_service),
):
    if not user:
        return RedirectResponse(url="/account/login", status_code=303)

    # Update user profile
    auth_service.update_profile(user.id, full_name)

    # Refresh user data and return to profile with success
    updated_user = auth_service.repo.get_by_id(user.id)
    avg_macros = food_log_service.get_average_macros(updated_user.id)

    return templates.TemplateResponse(
        "profile.html",
        {
            "request": request,
            "user": updated_user,
            "avg_macros": avg_macros,
            "profile_success": "Cập nhật thông tin thành công!",
        },
    )
