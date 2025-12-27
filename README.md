# Nutrition Tracker

Nutrition Tracker is a full-stack web application for daily calorie and nutrition tracking with AI-powered food recognition. Built as a university project, it demonstrates user authentication (local + Supabase OAuth), food database management with full-text search, meal logging, and comprehensive health metrics calculation.

🔗 **Live Demo:** https://mahoodd-nutri-tracker.hf.space/

---

## ✨ Features

- 👥 **User Accounts:** Sign up, sign in, profile management, password change
- 🔐 **Authentication:** Local login + Supabase OAuth integration
- 📸 **AI Food Recognition:** Real-time food detection from camera/images using EfficientNet-B3
- 🍽️ **Meal Logging:** Log meals manually or via AI prediction with portion tracking
- 📊 **Personal Foods:** Create and manage custom food items with nutrition data
- 🎯 **Health Metrics:** BMI, TDEE calculation based on personal profile
- 📈 **Nutrition Tracking:** Daily calorie, protein, carbs, fat monitoring
- 🔎 **Full-Text Search:** PostgreSQL-powered FTS with accent-insensitive search
- 📱 **Responsive Dashboard:** Weight history charts, recent meals, daily summary
- 🧾 **Admin Panel:** Manage users, foods, view system statistics
- 🛡️ **CSRF Protection:** Secure form handling with token validation
- 🖼️ **Image Upload:** Cloudinary integration for meal photos
- 🌐 **Multilingual:** Vietnamese and English UI support

---

## 🛠️ Tech Stack

| Technology            | Purpose                                             |
| :-------------------- | :-------------------------------------------------- |
| Python 3.9+           | Backend programming language                        |
| FastAPI               | Modern async web framework                          |
| SQLAlchemy            | SQL ORM for database abstraction                    |
| PostgreSQL (Supabase) | Primary database with full-text search capabilities |
| Jinja2                | Server-side templating                              |
| PyTorch               | Deep learning framework for AI model                |
| EfficientNet-B3       | Pre-trained CNN for food classification             |
| Supabase              | Managed PostgreSQL + OAuth provider                 |
| Cloudinary            | Cloud image storage and CDN                         |
| bcrypt                | Password hashing                                    |
| python-jose           | JWT token generation and validation                 |
| Uvicorn               | ASGI server                                         |

---

## ✅ Prerequisites

- **Python 3.9+** (3.10+ recommended)
- **PostgreSQL 14+** or a Supabase account (free tier available)
- **Git** (optional, for cloning)
- A **Cloudinary account** (free tier for image uploads)
- A **Supabase account** (for OAuth and database hosting)

---

## ⚙️ Installation & Setup (Local)

### 1. Clone the Repository

```bash
git clone https://github.com/RidoziKishito/calorie-tracker.git
cd calorie-tracker
```

### 2. Create a Virtual Environment

```bash
# Using venv (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Core Configuration
DEBUG=False
SECRET_KEY=your-secret-key-change-me-in-production
DATABASE_URL=postgresql://user:password@host:port/dbname

# Supabase (OAuth & Database)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Logging
LOG_LEVEL=INFO
```

**Notes:**

- Get `DATABASE_URL` from Supabase Project Settings → Database
- `SUPABASE_KEY` is the anon key (safe for frontend)
- `SUPABASE_SERVICE_KEY` is the service role key (backend only, never expose)
- For Cloudinary, sign up at https://cloudinary.com and get your credentials from the dashboard

### 5. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL migration from `database_schemas.txt` (copy entire content and paste into SQL Editor)
4. This will create all required tables, indexes, and functions
5. Verify tables appear in the "Tables" section

#### Option B: Local PostgreSQL

```bash
# Create database
createdb nutrition_tracker

# Run migrations
psql -U postgres -d nutrition_tracker -f database_schemas.txt
```

### 6. Download AI Model Files

The app requires pre-trained model weights for food recognition:

1. Download `food_model.pth` and `labels.txt` from the project's model artifacts
2. Place them in the project root directory (same level as `app/` folder):
   ```
   calorie-tracker/
   ├── food_model.pth     ← Put model here
   ├── labels.txt         ← Put labels here
   ├── app/
   ├── README.md
   └── requirements.txt
   ```

---

## 🚀 Running Locally

### Development Mode (with hot reload)

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Then open your browser and visit: **http://localhost:8000**

---

## 🗂️ Project Structure

```
calorie-tracker/
├── app/                          # Main application package
│   ├── main.py                   # FastAPI app initialization & routes
│   ├── deps.py                   # Dependency injection for FastAPI
│   │
│   ├── core/                     # Core modules
│   │   ├── config.py            # Settings management (Pydantic)
│   │   ├── database.py          # SQLAlchemy engine & session setup
│   │   ├── security.py          # Password hashing & JWT operations
│   │   ├── ai_predictor.py      # EfficientNet food classification model
│   │   ├── csrf.py              # CSRF token generation & validation
│   │   └── supabase_client.py   # Supabase SDK initialization
│   │
│   ├── models/                   # SQLAlchemy ORM models
│   │   ├── user.py              # User entity with enums
│   │   ├── health_status.py     # Health metrics & BMI/TDEE calculation
│   │   ├── foods.py             # Public food database
│   │   ├── personal_foods.py    # User-created custom foods
│   │   ├── food_logs.py         # Meal log entries
│   │   └── ai_logs.py           # AI prediction history
│   │
│   ├── repositories/             # Data access layer
│   │   ├── user_repository.py
│   │   ├── food_repository.py   # Includes full-text search methods
│   │   ├── food_logs_repository.py
│   │   ├── personal_food_repository.py
│   │   └── health_repository.py
│   │
│   ├── services/                 # Business logic layer
│   │   ├── auth_service.py      # Registration, login, onboarding
│   │   ├── food_service.py      # Food CRUD operations
│   │   ├── food_logs_service.py # Meal logging logic
│   │   ├── personal_food_service.py
│   │   ├── admin_service.py     # Admin panel operations
│   │   └── cloudinary_service.py # Image upload handling
│   │
│   ├── routers/                  # FastAPI route handlers
│   │   ├── auth_router.py       # Authentication endpoints
│   │   ├── home_router.py       # Dashboard & meal logging routes
│   │   ├── camera_router.py     # AI food recognition endpoints
│   │   └── admin_router.py      # Admin management routes
│   │
│   ├── templates/               # Jinja2 HTML templates
│   │   ├── base.html            # Base layout template
│   │   ├── welcome.html
│   │   ├── auth.html            # Login page
│   │   ├── register.html
│   │   ├── onboarding.html      # User profile setup
│   │   ├── dashboard.html       # Main user dashboard
│   │   ├── diary.html           # Meal diary view
│   │   ├── camera_scan.html     # Food camera interface
│   │   ├── create_meal.html     # Create custom food
│   │   ├── admin_*.html         # Admin panel templates
│   │   └── ...
│   │
│   └── static/                  # Static assets
│       ├── css/
│       │   ├── style.css        # Main styles
│       │   └── welcome.css      # Welcome page styles
│       └── js/
│           └── main.js          # Frontend logic
│
├── database_schemas.txt         # SQL schema definition
├── food_model.pth              # Pre-trained AI model weights
├── labels.txt                  # Food class labels for AI model
├── requirements.txt            # Python dependencies
├── .env.example               # Example environment variables
└── README.md                  # This file
```

---

## 📊 Database Schema Overview

### Core Tables

- **users** — User accounts with authentication
- **health_status** — Health metrics history (weight, height, BMI, TDEE)
- **foods** — Public food database with AI prediction matching
- **personal_foods** — User-created custom food items
- **food_logs** — Meal history with nutrition data
- **ai_logs** — AI prediction records for accuracy tracking

### Key Features

- **Full-Text Search (FTS)** — Accent-insensitive search on food names using PostgreSQL `tsvector`
- **Computed Columns** — `fts_vector` auto-generated for foods & personal_foods
- **Indexes** — GIN indexes on FTS vectors for fast queries
- **Immutable Function** — `fn_remove_accents_immutable()` for accent removal in search

---

## 🔧 Configuration Details

### AI Model Setup

The application uses **EfficientNet-B3** pre-trained on Vietnamese food dataset:

- **Model File:** `food_model.pth` (PyTorch weights)
- **Input Size:** 300×300 pixels
- **Preprocessing:** ImageNet normalization (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
- **Output:** Food class label + confidence score

The `ai_predictor.py` module handles:

```python
from app.core.ai_predictor import predictor

# Load model (lazy loading on first use)
label, confidence = predictor.predict(image_bytes)
```

### Authentication Flow

1. **Local Auth:** Email + password with bcrypt hashing
2. **Supabase OAuth:** Google/GitHub sign-in (optional)
3. **JWT Tokens:** HttpOnly cookies with 30-minute expiry
4. **Session:** Server-side session via FastAPI SessionMiddleware

### CSRF Protection

- Session-based CSRF tokens for sensitive POST requests
- Token validation on form submissions
- Secrets module for cryptographic token generation

---

## 🌐 Environment Variables

| Variable              | Required | Description                                |
| :-------------------- | :------- | :----------------------------------------- |
| DEBUG                 | No       | Debug mode (False in production)           |
| SECRET_KEY            | Yes      | JWT signing key (use 32+ character random) |
| DATABASE_URL          | Yes      | PostgreSQL connection string               |
| SUPABASE_URL          | Yes      | Supabase project URL                       |
| SUPABASE_KEY          | Yes      | Supabase anon public key                   |
| SUPABASE_SERVICE_KEY  | Yes      | Supabase service role key                  |
| CLOUDINARY_CLOUD_NAME | Yes      | Cloudinary account cloud name              |
| CLOUDINARY_API_KEY    | Yes      | Cloudinary API key                         |
| CLOUDINARY_API_SECRET | Yes      | Cloudinary API secret                      |
| LOG_LEVEL             | No       | Logging level (INFO, DEBUG, etc.)          |

---

## 📁 Deployment to Hugging Face Spaces (Current Setup)

The application is deployed at: **https://mahoodd-nutri-tracker.hf.space/**

### Steps to Deploy (Hugging Face Spaces)

1. **Create a Space:**

   - Go to https://huggingface.co/spaces
   - Click "Create new Space"
   - Select "Docker" runtime

2. **Add Files:**

   - Upload all files from this repository
   - Include `food_model.pth` and `labels.txt`

3. **Create Dockerfile:**

   ```dockerfile
   FROM python:3.10-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
   ```

4. **Set Secrets:**

   - In Space Settings → Secrets, add all `.env` variables:
     - `DATABASE_URL`
     - `SECRET_KEY`
     - `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_KEY`
     - Cloudinary credentials

5. **Deploy:**
   - Push to your Space's Git repo or upload files through the interface
   - Space will auto-build and deploy

---

## 🐛 Troubleshooting

### Issue: "Food model not found"

- **Solution:** Verify `food_model.pth` and `labels.txt` are in project root
- Check file permissions: `ls -la food_model.pth`

### Issue: "CSRF token validation failed"

- **Solution:** Enable SessionMiddleware (already configured in `main.py`)
- Check cookies are being sent: Browser DevTools → Application → Cookies

### Issue: "Database connection refused"

- **Solution:** Verify `DATABASE_URL` in `.env`
- For Supabase: Check IP whitelist in project settings
- Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Issue: "AI predictions not working"

- **Solution:** Ensure PyTorch is installed: `pip install torch torchvision`
- Check CUDA availability if using GPU: `python -c "import torch; print(torch.cuda.is_available())"`

### Issue: "Image upload fails"

- **Solution:** Verify Cloudinary credentials in `.env`
- Check API key hasn't expired in Cloudinary dashboard

### Issue: "OAuth redirect_uri_mismatch"

- **Solution:** Configure Supabase OAuth settings in project authentication
- Add your deployed URL as authorized redirect URI
- Ensure `SUPABASE_URL` matches the project URL

---

## 📚 API Documentation

FastAPI auto-generates interactive API docs:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

Main endpoints:

| Endpoint              | Method   | Purpose                      |
| :-------------------- | :------- | :--------------------------- |
| `/account/login`      | GET/POST | User login                   |
| `/account/register`   | GET/POST | User registration            |
| `/account/onboarding` | GET/POST | Complete user profile setup  |
| `/home/dashboard`     | GET      | Main user dashboard          |
| `/home/diary`         | GET/POST | View/add meals               |
| `/camera/scan`        | GET      | Food recognition interface   |
| `/camera/result`      | POST     | Process uploaded food image  |
| `/admin/`             | GET      | Admin dashboard (admin only) |
| `/admin/foods`        | GET      | Manage food database         |
| `/admin/users`        | GET      | Manage user accounts         |

---

## 🔒 Security Notes

- ✅ **Never commit `.env` file** — use `.env.example`
- ✅ **Change `SECRET_KEY`** before production
- ✅ **Use HTTPS** in production
- ✅ **Enable CORS** only for trusted origins
- ✅ **Database passwords** should be strong and unique
- ✅ **Keep dependencies updated** — run `pip install -U -r requirements.txt`
- ✅ **Input validation** — all form inputs are validated server-side
- ✅ **CSRF tokens** — required for state-changing operations
- ⚠️ **AI model security** — can be spoofed with misleading images (intentional behavior for training feedback)

See `security_audit_report.md` for detailed security analysis.

---

## 📝 Database Maintenance

### Backup Database (Supabase)

```bash
# Using pg_dump
pg_dump $DATABASE_URL > backup.sql

# Or use Supabase dashboard: Database → Backups
```

### Restore Database

```bash
psql $DATABASE_URL < backup.sql
```

### Monitor Disk Usage (Supabase)

- Dashboard → Reports → Storage Usage
- Archive old `food_logs` if needed: `DELETE FROM food_logs WHERE eaten_at < NOW() - INTERVAL '1 year'`

---

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Batch meal logging from image gallery
- [ ] Nutrition plan recommendations
- [ ] Social features (share meal plans)
- [ ] Integration with fitness trackers
- [ ] Multi-language support (in progress)
- [ ] Export meal data (PDF/CSV)
- [ ] Meal planning with recipe suggestions

---

## 🙌 Acknowledgements

- **OpenAI & PyTorch** for AI/ML tools
- **Supabase** for serverless PostgreSQL
- **Cloudinary** for image hosting
- **FastAPI** community for excellent documentation
- University instructors and classmates for feedback

---

## 📄 License

This project is open source and available under the **MIT License**. See LICENSE file for details.

---

## 🤝 Contact & Support

If you encounter any issues or have questions about this project, feel free to reach out:

- 📧 Email: huytranquoc24@gmail.com
- 🌐 Facebook: https://www.facebook.com/huy.tranquoc.129357/
- 💼 LinkedIn: https://www.linkedin.com/in/tran-quoc-huy-0612-ai/

---

## 👨‍💻 Project Team

💡 Created with ❤️ by:

- **Tran Quoc Huy** - 23110026
- **Le Huu Truc** - 23110068

---

## 📸 Screenshots

### Dashboard

<img width="1229" height="822" alt="image" src="https://github.com/user-attachments/assets/d8ba6d03-7696-4ba7-aaa2-39b96e44a357" />

---

## 🚀 Quick Start Command

After setup:

```bash
# Activate venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Run server
uvicorn app.main:app --reload

# Visit http://localhost:8000
```

---

**Last Updated:** December 2024  
**Python Version:** 3.9+  
**Framework:** FastAPI 0.100+
