import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")

# Public client (for frontend-like operations)
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Service client (for admin operations)
supabase_admin: Client = create_client(supabase_url, supabase_service_key) if supabase_url and supabase_service_key else None

def verify_supabase_token(token: str):
    """Verify a Supabase JWT token and return user data"""
    # Use admin client for stricter verification if available, otherwise public client
    client = supabase_admin if supabase_admin else supabase
    
    if not client:
        return None
    
    try:
        user = client.auth.get_user(token)
        return user
    except Exception as e:
        print(f"Token verification error: {e}")
        return None
