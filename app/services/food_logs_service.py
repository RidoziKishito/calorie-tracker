from app.repositories import FoodLogRepository
from app.models.food_logs import FoodLog

class FoodLogService:
    def __init__(self, repo: FoodLogRepository):
        self.repo = repo

    def add_food_log(self, user_id: int, final_food_name: str, calories: float, carbs: float = 0, protein: float = 0, fat: float = 0, meal_type: str = "Snack", food_id=None, personal_food_id=None, image_url=None):
        from datetime import datetime
        food_log = FoodLog(
            user_id=user_id,
            food_id=food_id,
            personal_food_id=personal_food_id,
            image_url=image_url,
            final_food_name=final_food_name,
            calories=int(round(calories)), # Enforce Int
            carbs=carbs,
            protein=protein,
            fat=fat,
            meal_type=meal_type,
            eaten_at=datetime.now() # Explicitly set local time
        )
        return self.repo.create(food_log)

    def get_recent_food_logs(self, user_id: int, limit: int = 10):
        return self.repo.get_recent_by_user(user_id, limit)

    def get_food_logs_by_date(self, user_id: int, date):
        return self.repo.get_by_user_and_date(user_id, date)
        
    def get_total_calories_for_date(self, user_id: int, date):
        return self.repo.get_total_calories_by_date(user_id, date)

    def get_average_macros(self, user_id: int, days: int = 7):
        from datetime import date, timedelta
        end_date = date.today()
        start_date = end_date - timedelta(days=days-1) # Inclusive of today, 7 days total
        logs = self.repo.get_by_user_date_range(user_id, start_date, end_date)
        
        if not logs:
            return {'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0}
        
        # Calculate daily averages
        # To be accurate, we should divide by 'days' (7), assuming 0 for days without logs if we want strict "Last 7 Days Avg".
        # Or divide by number of unique days with logs?
        # Standard "Avg 7 Days" usually means Sum / 7.
        
        return {
            'calories': sum(l.calories for l in logs) / days,
            'protein': sum(l.protein for l in logs) / days,
            'carbs': sum(l.carbs for l in logs) / days,
            'fat': sum(l.fat for l in logs) / days
        }

    def get_food_log_by_id(self, id: int):
        return self.repo.get_by_id(id)