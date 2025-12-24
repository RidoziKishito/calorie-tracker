import secrets
from fastapi import Request, HTTPException, status

CSRF_SESSION_KEY = "csrf_token"


def issue_csrf_token(request: Request) -> str:
    """Ensure a CSRF token exists in session and return it."""
    token = request.session.get(CSRF_SESSION_KEY)
    if not token:
        token = secrets.token_urlsafe(32)
        request.session[CSRF_SESSION_KEY] = token
    return token


def validate_csrf(request: Request, token: str) -> None:
    """Validate provided token against the one stored in session."""
    session_token = request.session.get(CSRF_SESSION_KEY)
    if (
        not token
        or not session_token
        or not secrets.compare_digest(token, session_token)
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid CSRF token"
        )
