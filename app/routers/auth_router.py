from fastapi import APIRouter, Request, Form, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse, JSONResponse
from app.services.auth_service import AuthService
from app.deps import get_auth_service
from app.core.security import create_access_token
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(tags=["Authentication"])
templates = Jinja2Templates(directory="app/templates")


@router.get("/welcome", include_in_schema=False)
async def welcome_page(request: Request):
    return templates.TemplateResponse("welcome.html", {"request": request})


@router.get("/account/login", include_in_schema=False)
async def login_page(request: Request):
    return templates.TemplateResponse("auth.html", {"request": request})

@router.post("/account/login", include_in_schema=False)
async def login_submit(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    service: AuthService = Depends(get_auth_service)
):
    try:
        user = service.authenticate_user(email, password)
        if not user:
            return templates.TemplateResponse("auth.html", {
                "request": request,
                "error": "Email hoặc mật khẩu không đúng!"
            })
        
        target_url = "/home/dashboard"
        if user.role.value == "admin":
            target_url = "/admin/"
            
        response = RedirectResponse(url=target_url, status_code=303)
        access_token = create_access_token(subject=user.id)
        response.set_cookie(key="access_token", value=access_token, httponly=True)
        # Clear old session cookies if they exist
        response.delete_cookie("session_token")
        response.delete_cookie("user_id")
        return response
    except Exception as e:
        print(f"Login Error: {e}")
        import traceback
        traceback.print_exc()
        return templates.TemplateResponse("auth.html", {
            "request": request,
            "error": "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
        })

@router.get("/account/register", include_in_schema=False)
async def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@router.post("/account/register", include_in_schema=False)
async def register_submit(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    full_name: str = Form(...),
    service: AuthService = Depends(get_auth_service)
):
    if password != confirm_password:
        return templates.TemplateResponse("register.html", {
            "request": request,
            "error": "Mật khẩu xác nhận không khớp!"
        })
    
    user = service.register_user(email, password, full_name)
    
    if not user:
        return templates.TemplateResponse("register.html", {
            "request": request,
            "error": "Email này đã được sử dụng! Vui lòng chọn email khác."
        })
    
    response = RedirectResponse(url="/account/onboarding", status_code=303)
    response.set_cookie(key="registration_email", value=email)
    return response

@router.get("/account/onboarding", include_in_schema=False)
async def onboarding_page(request: Request):
    email = request.cookies.get("registration_email")
    if not email:
        return RedirectResponse(url="/account/register", status_code=303)
    return templates.TemplateResponse("onboarding.html", {"request": request, "email": email})

@router.post("/account/onboarding", include_in_schema=False)
async def onboarding_submit(
    request: Request,
    gender: str = Form(...),
    dob: str = Form(...),
    weight_kg: float = Form(...),
    height_cm: float = Form(...),
    activity_level: str = Form(...),
    service: AuthService = Depends(get_auth_service)
):
    email = request.cookies.get("registration_email")
    if not email:
        return RedirectResponse(url="/account/register", status_code=303)
    
    try:
        user = service.complete_onboarding(
            email=email, 
            dob_str=dob, 
            gender=gender, 
            weight=weight_kg, 
            height=height_cm, 
            activity_level=activity_level
        )
    except ValueError as e:
        return templates.TemplateResponse("onboarding.html", {
            "request": request,
            "email": email,
            "error": str(e)
        })
    except Exception as e:
        return templates.TemplateResponse("onboarding.html", {
            "request": request,
            "email": email,
            "error": "Lỗi xử lý onboarding."
        })
    
    if not user:
        # Should normally be caught by ValueError if invalid user, but just in case
        return RedirectResponse(url="/account/register", status_code=303)
    
    response = RedirectResponse(url="/home/dashboard", status_code=303)
    response.delete_cookie("registration_email")
    
    access_token = create_access_token(subject=user.id)
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    
    return response

@router.post("/account/logout", include_in_schema=False)
async def logout():
    response = RedirectResponse(url="/welcome", status_code=303)
    response.delete_cookie("access_token")
    # Clean up legacy cookies as well
    response.delete_cookie("session_token")
    response.delete_cookie("user_id")
    response.delete_cookie("registration_email")
    return response


@router.post("/account/oauth/sync")
async def sync_supabase_auth(
    request: Request,
    service: AuthService = Depends(get_auth_service)
):
    """
    Sync Supabase authenticated user to public.users table.
    Called from frontend after successful Supabase OAuth.
    """
    try:
        # Get Supabase token from request body
        data = await request.json()
        access_token = data.get('access_token')
        user_data = data.get('user')
        
        if not access_token or not user_data:
            return JSONResponse({"error": "Missing authentication data"}, status_code=400)
        
        # Verify token with Supabase
        try:
            from app.core.supabase_client import verify_supabase_token
            verified_user = verify_supabase_token(access_token)
            
            if not verified_user:
                return JSONResponse({"error": "Invalid token"}, status_code=401)
        except Exception as verify_error:
            print(f"Token verification error: {verify_error}")
            return JSONResponse({"error": "Token verification failed"}, status_code=401)
        
        email = user_data.get('email')
        full_name = user_data.get('user_metadata', {}).get('full_name') or user_data.get('user_metadata', {}).get('name') or email.split('@')[0]
        supabase_id = user_data.get('id')
        
        # Sync to public.users
        user = service.sync_supabase_user(email, full_name, supabase_id)
        
        # Check if needs onboarding
        needs_onboarding = not user.health_status
        
        response = JSONResponse({
            "success": True,
            "user_id": user.id,
            "needs_onboarding": needs_onboarding,
            "redirect_url": "/account/onboarding" if needs_onboarding else "/home/dashboard"
        })
        
        # Issue JWT for backend session as well
        access_token = create_access_token(subject=user.id)
        response.set_cookie(key="access_token", value=access_token, httponly=True)
        
        return response
        
    except Exception as e:
        print(f"Supabase sync error: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse({"error": str(e)}, status_code=500)


@router.get("/api/supabase/config")
async def get_supabase_config():
    """Provide Supabase public config to frontend"""
    return JSONResponse({
        "url": os.getenv("SUPABASE_URL"),
        "key": os.getenv("SUPABASE_KEY")
    })


@router.get("/account/oauth/callback", include_in_schema=False)
async def oauth_callback(request: Request):
    """Render callback page that handles Supabase OAuth redirect"""
    return templates.TemplateResponse("oauth_callback.html", {"request": request})
