from fastapi import APIRouter, Request, Depends, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse

from app.deps import get_admin_user, get_admin_service, get_food_service
from app.services.admin_service import AdminService
from app.services.food_service import FoodService

router = APIRouter(prefix="/admin", tags=["Admin"])
templates = Jinja2Templates(directory="app/templates")


@router.get("")
async def admin_root_redirect():
    return RedirectResponse(url="/admin/", status_code=303)


@router.get("/")
async def admin_dashboard(
    request: Request, 
    user=Depends(get_admin_user), 
    admin_service: AdminService = Depends(get_admin_service)
):
    stats = admin_service.get_dashboard_stats()
    return templates.TemplateResponse("admin_dashboard.html", {
        "request": request, 
        "user": user,
        "total_users": stats["total_users"],
        "total_foods": stats["total_foods"],
        "total_logs": stats["total_logs"]
    })


@router.get("/users")
async def admin_users(
    request: Request, 
    user=Depends(get_admin_user), 
    admin_service: AdminService = Depends(get_admin_service)
):
    users = admin_service.get_all_users(limit=100)
    return templates.TemplateResponse("admin_users.html", {
        "request": request,
        "user": user,
        "users": users
    })


@router.get("/foods")
async def admin_foods(
    request: Request, 
    user=Depends(get_admin_user), 
    food_service: FoodService = Depends(get_food_service)
):
    foods = food_service.get_all_foods()
    return templates.TemplateResponse("admin_foods.html", {
        "request": request,
        "user": user,
        "foods": foods
    })


@router.get("/foods/create")
async def create_food_page(request: Request, user=Depends(get_admin_user)):
    return templates.TemplateResponse("admin_food_form.html", {
        "request": request,
        "user": user,
        "food": None
    })


@router.post("/foods/create")
async def create_food(
    request: Request,
    name: str = Form(...),
    calories: float = Form(...),
    protein: float = Form(0),
    carbs: float = Form(0),
    fat: float = Form(0),
    unit: str = Form("phần"),
    ai_slug: str = Form(None),
    user=Depends(get_admin_user),
    food_service: FoodService = Depends(get_food_service)
):
    food_service.create_food(
        name=name,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
        unit=unit,
        ai_slug=ai_slug
    )
    return RedirectResponse(url="/admin/foods", status_code=303)


@router.get("/foods/edit/{id}")
async def edit_food_page(
    request: Request, 
    id: int, 
    user=Depends(get_admin_user),
    food_service: FoodService = Depends(get_food_service)
):
    food = food_service.get_food_by_id(id)
    if not food:
        return RedirectResponse(url="/admin/foods", status_code=303)
    return templates.TemplateResponse("admin_food_form.html", {
        "request": request,
        "user": user,
        "food": food
    })


@router.post("/foods/update")
async def update_food(
    request: Request,
    id: int = Form(...),
    name: str = Form(...),
    calories: float = Form(...),
    protein: float = Form(0),
    carbs: float = Form(0),
    fat: float = Form(0),
    unit: str = Form("phần"),
    ai_slug: str = Form(None),
    user=Depends(get_admin_user),
    food_service: FoodService = Depends(get_food_service)
):
    food_service.update_food(
        food_id=id,
        name=name,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
        unit=unit,
        ai_slug=ai_slug
    )
    return RedirectResponse(url="/admin/foods", status_code=303)


@router.post("/foods/delete/{id}")
async def delete_food(
    request: Request, 
    id: int, 
    user=Depends(get_admin_user),
    food_service: FoodService = Depends(get_food_service)
):
    food_service.delete_food(id)
    return RedirectResponse(url="/admin/foods", status_code=303)


@router.get("/users/edit/{id}")
async def edit_user_page(
    request: Request, 
    id: int, 
    user=Depends(get_admin_user), 
    admin_service: AdminService = Depends(get_admin_service)
):
    target_user = admin_service.get_user_by_id(id)
    if not target_user:
        return RedirectResponse(url="/admin/users", status_code=303)
    return templates.TemplateResponse("admin_user_form.html", {
        "request": request, 
        "user": user, 
        "target_user": target_user
    })


@router.post("/users/update")
async def update_user(
    request: Request,
    id: int = Form(...),
    full_name: str = Form(...),
    email: str = Form(...),
    role: str = Form(...),
    user=Depends(get_admin_user),
    admin_service: AdminService = Depends(get_admin_service)
):
    admin_service.update_user(id, full_name, email, role)
    return RedirectResponse(url="/admin/users", status_code=303)


@router.post("/users/reset-password")
async def reset_user_password(
    request: Request,
    id: int = Form(...),
    new_password: str = Form(...),
    user=Depends(get_admin_user),
    admin_service: AdminService = Depends(get_admin_service)
):
    admin_service.reset_user_password(id, new_password)
    return RedirectResponse(url=f"/admin/users/edit/{id}", status_code=303)
