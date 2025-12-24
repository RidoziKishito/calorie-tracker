from app.repositories import UserRepository
from app.repositories.health_repository import HealthRepository
from app.models.user import User, GenderEnum
from app.models.health_status import HealthStatus, ActivityLevelEnum
from datetime import datetime, date
import bcrypt
import re


def _validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password strength:
    - Minimum 8 characters
    - At least one uppercase letter (A-Z)
    - At least one lowercase letter (a-z)
    - At least one digit (0-9)
    - At least one special character (!@#$%^&* etc.)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"

    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"

    if not re.search(r"[!@#$%^&*()_+=\-\[\]{};:'\",.<>?/\\|`~]", password):
        return False, "Password must contain at least one special character"

    return True, "Password is strong"


class AuthService:
    def __init__(self, repo: UserRepository, health_repo: HealthRepository):
        self.repo = repo
        self.health_repo = health_repo

    def _hash_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def _verify_password(self, password: str, hashed: str) -> bool:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

    def register_user(self, email: str, password: str, full_name: str):
        existing_user = self.repo.get_by_email(email)
        if existing_user:
            return None

        # Validate password strength
        is_strong, message = _validate_password_strength(password)
        if not is_strong:
            raise ValueError(message)

        hashed_password = self._hash_password(password)
        new_user = User(
            email=email,
            password_hash=hashed_password,
            full_name=full_name,
            dob=date(2000, 1, 1),
        )

        self.repo.create_user(new_user)
        self.repo.db.commit()
        self.repo.db.refresh(new_user)
        return new_user

    def authenticate_user(self, email: str, password: str):
        user = self.repo.get_by_email(email)
        if not user:
            return None
        if not self._verify_password(password, user.password_hash):
            return None
        return user

    def _calculate_metrics(
        self,
        weight: float,
        height: float,
        dob: date,
        gender: GenderEnum,
        activity_level: str,
    ) -> dict:
        if weight <= 0 or height <= 0:
            raise ValueError("Weight and height must be positive numbers.")

        height_m = height / 100
        bmi = round(weight / (height_m**2), 2)

        activity_multipliers = {"Sedentary": 1.2, "Moderate": 1.55, "Active": 1.725}
        activity_keys = {
            "low": "Sedentary",
            "sedentary": "Sedentary",
            "medium": "Moderate",
            "moderate": "Moderate",
            "high": "Active",
            "active": "Active",
        }

        if isinstance(activity_level, ActivityLevelEnum):
            normalized_level = activity_level.value
        else:
            normalized_level = activity_keys.get(
                str(activity_level).lower(), "Sedentary"
            )
            if str(activity_level) in activity_multipliers:
                normalized_level = str(activity_level)

        multiplier = activity_multipliers.get(normalized_level, 1.2)
        try:
            act_enum = ActivityLevelEnum(normalized_level)
        except ValueError:
            act_enum = ActivityLevelEnum.Sedentary

        # Calculate age with validation
        age = date.today().year - dob.year
        # Adjust for birthday not yet occurred this year
        if date.today() < dob.replace(year=date.today().year):
            age -= 1

        # Constrain age to reasonable bounds (1-120 years)
        age = max(1, min(age, 120))

        is_male = gender == GenderEnum.Male

        # Mifflin-St Jeor Equation for BMR
        if is_male:
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
        else:
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161

        # Ensure BMR is never below a safe minimum (800 kcal for children/small adults)
        bmr = max(bmr, 800)

        tdee = round(bmr * multiplier, 2)

        # Final safety check - TDEE should never be negative
        tdee = max(tdee, 1000)

        return {"bmi": bmi, "tdee": tdee, "activity_enum": act_enum}

    def complete_onboarding(
        self,
        email: str,
        dob_str: str,
        gender: str,
        weight: float,
        height: float,
        activity_level: str,
    ):

        user = self.repo.get_by_email(email)
        if not user:
            return None

        try:
            user.dob = datetime.strptime(dob_str, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Invalid date format. Please use YYYY-MM-DD.")

        try:
            user.gender = GenderEnum(gender)
        except ValueError:
            try:
                user.gender = GenderEnum(gender.capitalize())
            except ValueError:
                raise ValueError(f"Invalid gender: {gender}")

        self.repo.update_user(user)

        metrics = self._calculate_metrics(
            weight, height, user.dob, user.gender, activity_level
        )

        health = HealthStatus(
            user_id=user.id,
            weight_kg=weight,
            height_cm=height,
            activity_level=metrics["activity_enum"],
            bmi=metrics["bmi"],
            tdee=metrics["tdee"],
        )

        self.health_repo.create(health)
        self.repo.db.refresh(user)

        return user

    def update_health(self, user_id: int, weight: float, height: float):
        user = self.repo.get_by_id(user_id)
        if not user:
            return None

        latest_health = self.health_repo.get_latest_by_user(user_id)
        current_activity = (
            latest_health.activity_level if latest_health else "Sedentary"
        )

        metrics = self._calculate_metrics(
            weight, height, user.dob, user.gender, current_activity
        )

        new_health = HealthStatus(
            user_id=user_id,
            weight_kg=weight,
            height_cm=height,
            bmi=metrics["bmi"],
            tdee=metrics["tdee"],
            activity_level=metrics["activity_enum"],
        )

        self.health_repo.create(new_health)

        return new_health

    def change_password(self, user_id: int, old_password: str, new_password: str):
        user = self.repo.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        if not self._verify_password(old_password, user.password_hash):
            return False

        # Validate password strength
        is_strong, message = _validate_password_strength(new_password)
        if not is_strong:
            raise ValueError(message)

        user.password_hash = self._hash_password(new_password)
        self.repo.update_user(user)
        self.repo.db.commit()

        return True

    def update_avatar(self, user_id: int, avatar_url: str):
        user = self.repo.get_by_id(user_id)
        if not user:
            return None

        user.avatar_url = avatar_url
        self.repo.update_user(user)
        self.repo.db.commit()
        return user

    def update_profile(self, user_id: int, full_name: str):
        user = self.repo.get_by_id(user_id)
        if not user:
            return None

        user.full_name = full_name
        self.repo.update_user(user)
        self.repo.db.commit()
        return user

    def generate_random_password(self) -> str:
        """Generate a secure random password for OAuth users"""
        import secrets
        import string

        alphabet = string.ascii_letters + string.digits + string.punctuation
        password = "".join(secrets.choice(alphabet) for i in range(32))
        return password

    def sync_supabase_user(
        self, email: str, full_name: str, supabase_user_id: str = None
    ):
        """
        Sync Supabase auth user to public.users table.
        Get existing user by email, or create new user with random password.
        """
        # Check if user exists
        user = self.repo.get_by_email(email)

        if user:
            # User exists, return it
            return user

        # Create new user with random password
        random_password = self.generate_random_password()
        hashed_password = self._hash_password(random_password)

        new_user = User(
            email=email,
            password_hash=hashed_password,
            full_name=full_name,
            dob=date(2000, 1, 1),  # Placeholder, will be updated in onboarding
        )

        self.repo.create_user(new_user)
        self.repo.db.commit()
        self.repo.db.refresh(new_user)

        return new_user
