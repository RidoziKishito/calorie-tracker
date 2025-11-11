# 🥗 CalorieTracker - Smart Nutrition Tracking App

A full-stack web application for tracking calories and nutrition with AI-powered food recognition.

## 🏗️ Tech Stack

### Frontend

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Bootstrap 5** + **Tailwind CSS**
- **Radix UI** (Headless components)
- **Lucide React** (Icons)

### Backend

- **FastAPI** (Python web framework)
- **SQLAlchemy** (ORM)
- **SQLite** (Database)
- **JWT** (Authentication)
- **Simple AI Model** (Food recognition demo)

## 📁 Project Structure

```
CalorieTracker/
├── frontend/                   # React Frontend (current folder)
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API service
│   │   │   └── api.ts         # API client
│   │   ├── App.tsx            # Main app
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # FastAPI Backend
│   ├── api/
│   │   ├── auth.py            # Authentication logic
│   │   └── routes/            # API routes
│   │       ├── auth_routes.py
│   │       ├── profile_routes.py
│   │       ├── food_routes.py
│   │       └── ai_routes.py
│   ├── models/
│   │   ├── schemas.py         # Pydantic models
│   │   └── database_models.py # SQLAlchemy models
│   ├── database/
│   │   └── db.py             # Database connection
│   ├── ml/
│   │   └── food_ai.py        # AI model (simple demo)
│   ├── main.py               # FastAPI app
│   ├── requirements.txt
│   └── .env                  # Environment variables
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.9+
- **pip** (Python package manager)

### 1. Setup Backend (FastAPI)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Start backend server
python main.py
# or
uvicorn main:app --reload --port 8000
```

Backend will run at: **http://localhost:8000**
API Documentation: **http://localhost:8000/docs**

### 2. Setup Frontend (React)

```bash
# In the root folder (or frontend folder)
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

### 3. Access the App

Open your browser and go to:

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs

## 🎯 Features

### ✅ Authentication

- User signup with email & password
- User login with JWT tokens
- Secure authentication

### ✅ Profile Management

- Create and update user profile
- Set personal goals (lose/maintain/gain weight)
- Calculate daily calorie needs

### ✅ Food Logging

- Quick log (search from database)
- Manual log (enter nutrition manually)
- Picture log (upload food images)
- View, edit, and delete food logs

### ✅ AI Food Recognition (Demo)

- Analyze food from text description
- Analyze food from images (placeholder)
- Get nutritional information automatically

### ✅ Dashboard

- View daily calorie intake
- Track macronutrients (protein, carbs, fat)
- Progress visualization
- Meal plan suggestions

## 📝 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Food Logs

- `GET /api/food/logs` - Get all food logs
- `POST /api/food/log` - Add new food log
- `PUT /api/food/log/{id}` - Update food log
- `DELETE /api/food/log/{id}` - Delete food log

### AI

- `POST /api/ai/analyze-food` - Analyze food from text
- `POST /api/ai/analyze-food-image` - Analyze food from image

## 🔧 Configuration

### Backend (.env file)

```env
# Database
DATABASE_URL=sqlite:///./calorie_tracker.db

# JWT
SECRET_KEY=your-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_HOST=0.0.0.0
API_PORT=8000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend

No additional configuration needed. The API URL is automatically set to `http://localhost:8000`.

## 🧪 Testing

### Test Backend API

1. Go to http://localhost:8000/docs
2. Try the API endpoints with Swagger UI
3. Test signup/login flow
4. Test food logging features
5. Test AI food recognition

### Test Frontend

1. Open http://localhost:3000
2. Create a new account
3. Setup your profile
4. Add some food logs
5. Try the AI food recognition
6. Refresh page to see data persistence

## 📦 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Push code to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy!

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

## 🤖 AI Model Development

The current AI model is a simple demo. To integrate a real AI model:

1. **Food Recognition Model**:

   - Use pre-trained models (ResNet, EfficientNet)
   - Train on food datasets (Food-101, UECFOOD-256)
   - Use TensorFlow/PyTorch

2. **Nutrition Estimation**:

   - Use CV algorithms to estimate portion size
   - Query nutrition databases (USDA, Nutritionix API)
   - Apply ML models for calorie prediction

3. **Integration**:

   ```python
   # In backend/ml/food_ai.py
   import torch
   from torchvision import models, transforms

   # Load pre-trained model
   model = models.resnet50(pretrained=True)

   # Process image and predict
   # ...
   ```

## 📚 Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [JWT Authentication](https://jwt.io/)

## 🐛 Known Issues

- AI model is currently a simple demo (not real AI)
- Some TypeScript type conflicts in App.tsx (functional but shows warnings)
- Image upload for food recognition is placeholder only

## 🔜 Future Enhancements

- [ ] Real AI model for food recognition (CNN/ResNet)
- [ ] Barcode scanner for packaged foods
- [ ] Integration with nutrition APIs (Nutritionix, Edamam)
- [ ] Social features (share meals, friends)
- [ ] Progressive Web App (PWA) support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and insights
- [ ] Recipe suggestions based on goals
- [ ] Integration with fitness trackers

## 📄 License

This project is for educational purposes.

## 👤 Author

Created with ❤️ for IT Project

---

## 🎉 Getting Started Now!

**Backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

**Frontend:**

```bash
npm install
npm run dev
```

**Visit:** http://localhost:3000

Enjoy tracking your calories! 🥗🏃‍♂️💪
