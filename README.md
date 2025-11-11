# CalorieTracker - Smart Nutrition Tracking App

Full-stack calorie tracking app with AI-powered food recognition (demo).

## 🚀 Tech Stack
**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Radix UI  
**Backend:** FastAPI + SQLAlchemy + Supabase (Postgres) + JWT Auth

## 📋 Prerequisites
- Node.js 16+ and npm
- Python 3.10+
- Supabase account (or use SQLite locally)

## 🛠️ Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd Test
npm install
```

### 2. Setup Python Backend
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows PowerShell):
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r backend/requirements.txt
```

### 3. Configure Environment
Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:<PASSWORD>@<HOST>:5432/postgres
FRONTEND_URL=http://localhost:3001
```

### 4. Setup Supabase (optional)
- Create Supabase project
- Run SQL: `backend/sql/supabase_schema.sql`
- Copy connection string to DATABASE_URL

## ▶️ Run the App
```bash
npm start
```
Access: http://localhost:3001  
API Docs: http://localhost:8000/docs

## 📦 Scripts
- `npm start` - Run backend + frontend
- `npm run dev` - Frontend only
- `npm run build` - Build for production

## 🗂️ Structure
```
Test/
├── src/              # React frontend
├── backend/          # FastAPI backend
│   ├── api/          # Routes
│   ├── models/       # DB models
│   └── sql/          # Supabase schema
└── .venv/            # Python venv (gitignored)
```

## 🔐 Security
- Never commit `.env` files
- Use strong SECRET_KEY in production
- Enable Supabase RLS for production

## 🐛 Troubleshooting
**Import errors in VS Code?** Select Python interpreter: `.venv`  
**CORS errors?** Check FRONTEND_URL matches your port  
**Port in use?** Vite auto-increments (3000→3001)
