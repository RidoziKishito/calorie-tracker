# 🚀 HƯỚNG DẪN TÍCH HỢP FASTAPI - BƯỚC ĐẦU TIÊN

## 📝 QUICK START: Tích hợp FastAPI vào project hiện tại

### BƯỚC 1: Tạo Backend FastAPI cơ bản

#### 1.1 Tạo cấu trúc folder

```bash
# Trong folder gốc của project
mkdir backend
cd backend
```

#### 1.2 Tạo virtual environment và cài FastAPI

```bash
# Tạo virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Cài packages
pip install fastapi uvicorn sqlalchemy python-multipart pillow pydantic[email]
pip install python-jose[cryptography] passlib[bcrypt]

# Lưu dependencies
pip freeze > requirements.txt
```

#### 1.3 Tạo file main.py đơn giản

Tạo file `backend/main.py`:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="CalorieTracker API", version="1.0.0")

# CORS - cho phép frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ MODELS ============
class UserProfile(BaseModel):
    name: str
    email: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activityLevel: Optional[str] = None
    goal: Optional[str] = None
    dailyCalories: Optional[int] = 2000

class FoodLog(BaseModel):
    id: Optional[str] = None
    name: str
    calories: int
    protein: int
    carbs: int
    fat: int
    portion: str
    mealType: str
    timestamp: Optional[datetime] = None
    imageUrl: Optional[str] = None

# ============ FAKE DATABASE (tạm thời) ============
fake_users_db = {}
fake_food_logs_db = {}

# ============ API ENDPOINTS ============

@app.get("/")
def read_root():
    return {
        "message": "CalorieTracker API is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

# ===== USER PROFILE =====
@app.get("/api/profile/{user_email}")
def get_profile(user_email: str):
    if user_email not in fake_users_db:
        return UserProfile(
            name="Guest",
            email=user_email,
            dailyCalories=2000
        )
    return fake_users_db[user_email]

@app.post("/api/profile")
def create_or_update_profile(profile: UserProfile):
    fake_users_db[profile.email] = profile
    return {"message": "Profile updated successfully", "profile": profile}

# ===== FOOD LOGS =====
@app.get("/api/food/logs/{user_email}")
def get_food_logs(user_email: str):
    user_logs = fake_food_logs_db.get(user_email, [])
    return user_logs

@app.post("/api/food/log")
def add_food_log(log: FoodLog, user_email: str):
    # Generate ID và timestamp
    log.id = str(uuid.uuid4())
    log.timestamp = datetime.now()

    # Lưu vào fake DB
    if user_email not in fake_food_logs_db:
        fake_food_logs_db[user_email] = []

    fake_food_logs_db[user_email].insert(0, log.dict())

    return {
        "message": "Food log added successfully",
        "log": log
    }

@app.delete("/api/food/log/{log_id}")
def delete_food_log(log_id: str, user_email: str):
    if user_email in fake_food_logs_db:
        fake_food_logs_db[user_email] = [
            log for log in fake_food_logs_db[user_email]
            if log["id"] != log_id
        ]
    return {"message": "Food log deleted successfully"}

# ===== AUTHENTICATION =====
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def login(request: LoginRequest):
    # Giả lập login (sau này sẽ check database)
    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "email": request.email,
            "name": "User Name"
        },
        "token": "fake-jwt-token-123"
    }

@app.post("/api/auth/signup")
def signup(profile: UserProfile):
    # Giả lập signup
    fake_users_db[profile.email] = profile
    return {
        "success": True,
        "message": "Account created successfully",
        "user": profile,
        "token": "fake-jwt-token-456"
    }

# ===== AI ENDPOINTS (placeholder) =====
@app.post("/api/ai/analyze-food")
async def analyze_food_image():
    # Placeholder cho AI feature
    return {
        "food_name": "Cơm gà",
        "calories": 450,
        "protein": 25,
        "carbs": 60,
        "fat": 12,
        "confidence": 0.87,
        "message": "AI model will be integrated here"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
```

#### 1.4 Chạy backend

```bash
# Trong folder backend với venv activated
uvicorn main:app --reload --port 8000
```

Truy cập: http://localhost:8000/docs để xem API documentation!

---

### BƯỚC 2: Chỉnh sửa Frontend để gọi API

#### 2.1 Tạo API service

Tạo file `src/services/api.ts`:

```typescript
// src/services/api.ts
const API_BASE_URL = "http://localhost:8000/api";

export interface UserProfile {
  name: string;
  email: string;
  age?: number;
  gender?: "male" | "female" | "other";
  height?: number;
  weight?: number;
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very-active";
  goal?: "maintain" | "lose" | "gain";
  dailyCalories?: number;
}

export interface FoodLog {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  timestamp?: Date;
  imageUrl?: string;
}

class ApiService {
  // ===== Profile =====
  async getProfile(email: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profile/${email}`);
    return response.json();
  }

  async updateProfile(profile: UserProfile): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    return response.json();
  }

  // ===== Food Logs =====
  async getFoodLogs(email: string): Promise<FoodLog[]> {
    const response = await fetch(`${API_BASE_URL}/food/logs/${email}`);
    return response.json();
  }

  async addFoodLog(log: FoodLog, email: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/food/log?user_email=${email}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      }
    );
    return response.json();
  }

  async deleteFoodLog(logId: string, email: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/food/log/${logId}?user_email=${email}`,
      {
        method: "DELETE",
      }
    );
    return response.json();
  }

  // ===== Authentication =====
  async login(email: string, password: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async signup(profile: UserProfile): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    return response.json();
  }

  // ===== AI =====
  async analyzeFoodImage(imageFile: File): Promise<any> {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${API_BASE_URL}/ai/analyze-food`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  }
}

export const api = new ApiService();
```

#### 2.2 Chỉnh sửa App.tsx để sử dụng API

Chỉnh sửa `src/App.tsx`:

```typescript
// Thêm import
import { api } from "./services/api";
import { useEffect } from "react";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
  });
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);

  // Load data từ API khi app khởi động
  useEffect(() => {
    const loadUserData = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          // Load profile
          const profile = await api.getProfile(email);
          setUserProfile(profile);

          // Load food logs
          const logs = await api.getFoodLogs(email);
          setFoodLogs(logs);
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    };

    loadUserData();
  }, []);

  // Thay đổi addFoodLog để gọi API
  const addFoodLog = async (log: Omit<FoodLog, "id" | "timestamp">) => {
    try {
      const result = await api.addFoodLog(log, userProfile.email);
      const newLog = result.log;
      setFoodLogs([newLog, ...foodLogs]);
    } catch (error) {
      console.error("Error adding food log:", error);
    }
  };

  // Thay đổi updateUserProfile để gọi API
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...userProfile, ...updates };
    try {
      await api.updateProfile(updatedProfile);
      setUserProfile(updatedProfile);
      localStorage.setItem("userEmail", updatedProfile.email);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // ... rest of the code giữ nguyên
}
```

---

### BƯỚC 3: Test

#### 3.1 Chạy cả 2 servers

**Terminal 1 - Backend:**

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

#### 3.2 Test flow

1. Mở http://localhost:3000/
2. Đăng ký account mới
3. Tạo profile
4. Thêm food logs
5. **Refresh page** → Data vẫn còn! (khác với trước)

---

## 🎯 KẾT QUẢ

### ✅ Những gì đã đạt được:

1. **Backend FastAPI hoạt động** - API server chạy port 8000
2. **Frontend gọi API** - React app gọi backend thay vì lưu local
3. **Data persistence** - Data không mất khi refresh
4. **Giao diện giữ nguyên 100%** - Không thay đổi UI/UX

### 📊 So sánh:

| Feature        | Trước (Frontend only)    | Sau (FastAPI)          |
| -------------- | ------------------------ | ---------------------- |
| Data storage   | ❌ RAM (mất khi refresh) | ✅ Server (vĩnh viễn)  |
| API            | ❌ Không có              | ✅ REST API đầy đủ     |
| Authentication | ❌ Giả lập               | ✅ Có thể làm JWT thật |
| Giao diện      | ✅ Đẹp                   | ✅ Vẫn đẹp             |

---

## 🔜 BƯỚC TIẾP THEO

### 1. Thêm Database thật (thay vì fake_db)

```bash
pip install sqlalchemy psycopg2-binary
```

### 2. Thêm Authentication JWT thật

```bash
pip install python-jose[cryptography] passlib[bcrypt]
```

### 3. Tích hợp AI/ML

```bash
pip install torch torchvision tensorflow pillow
```

### 4. Deploy lên server

- Frontend: Vercel, Netlify
- Backend: Railway, Render, AWS

---

## 💡 LƯU Ý

1. **File backend/main.py này chỉ là bản DEMO cơ bản**
2. Fake database chỉ dùng để test, cần thay bằng PostgreSQL/MongoDB
3. Authentication chưa bảo mật, cần JWT tokens
4. Chưa có AI model thật, chỉ là placeholder

**Nhưng đã đủ để bạn:**

- ✅ Hiểu cách FastAPI hoạt động
- ✅ Biết cách connect frontend với backend
- ✅ Thấy data được lưu giữa các session
- ✅ Sẵn sàng để mở rộng thêm features

---

## 📚 TÀI LIỆU THAM KHẢO

1. **FastAPI Official Docs:** https://fastapi.tiangolo.com/
2. **FastAPI Tutorial:** https://fastapi.tiangolo.com/tutorial/
3. **SQLAlchemy Tutorial:** https://docs.sqlalchemy.org/
4. **JWT Authentication:** https://fastapi.tiangolo.com/tutorial/security/

---

Bạn muốn tôi giúp implement bước nào tiếp theo không? 😊
