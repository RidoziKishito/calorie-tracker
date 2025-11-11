# 🚀 HƯỚNG DẪN CHẠY NHANH - CalorieTracker

## ⚡ Chạy Demo Local trong 5 Phút

### Bước 1: Cài đặt Backend Python

```bash
# Vào folder backend
cd backend

# Tạo môi trường ảo Python
python -m venv venv

# Kích hoạt môi trường ảo (Windows)
venv\Scripts\activate

# Cài packages
pip install -r requirements.txt

# Chạy server
python main.py
```

✅ Backend chạy tại: **http://localhost:8000**
📚 Xem API docs: **http://localhost:8000/docs**

---

### Bước 2: Chạy Frontend React

Mở terminal mới (giữ terminal backend chạy):

```bash
# Vào folder gốc
cd ..

# Cài packages (nếu chưa cài)
npm install

# Chạy frontend
npm run dev
```

✅ Frontend chạy tại: **http://localhost:3000**

---

### Bước 3: Sử dụng App

1. Mở trình duyệt: **http://localhost:3000**
2. Nhấn "Bắt đầu ngay"
3. Đăng ký tài khoản mới
4. Setup profile (chiều cao, cân nặng, mục tiêu)
5. Thêm món ăn vào food log
6. Thử feature AI: Nhập tên món ăn để tự động lấy thông tin dinh dưỡng!

---

## 🎯 Test Các Features

### ✅ Authentication

- Đăng ký account mới
- Đăng xuất và đăng nhập lại
- Data vẫn còn (lưu trong database!)

### ✅ Food Logging

- Quick Log: Tìm món ăn nhanh
- Manual Log: Nhập thủ công
- Pic Log: Upload ảnh (demo)

### ✅ AI Features (Demo)

- Nhập "cơm gà" → Tự động lấy thông tin dinh dưỡng
- Thử: "phở bò", "bánh mì", "bún chả"
- AI sẽ trả về calories, protein, carbs, fat

---

## 🔍 Kiểm Tra Backend Hoạt Động

### Cách 1: Qua Browser

Mở: http://localhost:8000/docs

### Cách 2: Qua API Test

```bash
# Test health check
curl http://localhost:8000/health

# Test root endpoint
curl http://localhost:8000/
```

---

## ⚠️ Troubleshooting

### ❌ Backend không chạy?

**Lỗi: "Module not found"**

```bash
cd backend
pip install -r requirements.txt
```

**Lỗi: "Python not found"**

- Cài Python 3.9+ từ python.org
- Thêm Python vào PATH

**Lỗi: "Port 8000 already in use"**

```bash
# Đổi port trong backend/.env
API_PORT=8001

# Hoặc kill process đang dùng port 8000
```

### ❌ Frontend không chạy?

**Lỗi: "npm not found"**

- Cài Node.js từ nodejs.org

**Lỗi: "Port 3000 already in use"**

- Chọn Y khi Vite hỏi dùng port khác
- Hoặc kill process đang dùng port 3000

**Lỗi: "API connection failed"**

- Kiểm tra backend có đang chạy không
- Kiểm tra URL: http://localhost:8000

---

## 🗄️ Database

App sử dụng SQLite (file-based database):

- File: `backend/calorie_tracker.db`
- Tự động tạo khi chạy backend lần đầu
- Data lưu vĩnh viễn

Để xóa toàn bộ data:

```bash
cd backend
rm calorie_tracker.db
# Chạy lại python main.py để tạo database mới
```

---

## 📊 Data Flow

```
1. User đăng ký/đăng nhập
   ↓
2. Frontend gửi request đến Backend (FastAPI)
   ↓
3. Backend xác thực + lưu vào Database (SQLite)
   ↓
4. Backend trả về JWT token
   ↓
5. Frontend lưu token + gọi API với token
   ↓
6. Backend trả về data từ Database
   ↓
7. Frontend hiển thị data
```

---

## 🎨 Demo Flow

### 1. Welcome Screen

→ Nhấn "Bắt đầu ngay"

### 2. Signup Screen

→ Nhập tên, email, password
→ Nhấn "Đăng ký"

### 3. Setup Profile

→ Nhập tuổi, giới tính, chiều cao, cân nặng
→ Chọn mức độ hoạt động
→ Nhấn "Tiếp tục"

### 4. Goal Selection

→ Chọn mục tiêu (giảm/duy trì/tăng cân)
→ Nhấn "Bắt đầu theo dõi"

### 5. Dashboard

→ Xem tổng quan calories
→ Thêm món ăn
→ Xem progress

### 6. Try AI

→ Vào Quick Log hoặc Manual Log
→ Nhập tên món ăn (VD: "cơm gà")
→ AI tự động điền thông tin!

---

## 🌟 Features Đã Implement

- ✅ **Authentication với JWT** - Đăng ký/đăng nhập bảo mật
- ✅ **Database SQLite** - Lưu data vĩnh viễn
- ✅ **User Profile** - Quản lý thông tin cá nhân
- ✅ **Food Logging** - Ghi nhận món ăn
- ✅ **AI Demo** - Nhận diện món ăn từ text
- ✅ **Dashboard** - Hiển thị thống kê
- ✅ **Responsive Design** - Đẹp trên mọi thiết bị

---

## 📱 Screenshots

### Welcome Screen

- Gradient background màu tím đẹp
- Button "Bắt đầu ngay"

### Dashboard

- Calorie progress ring
- Macronutrients breakdown
- Food log list
- Add button (+)

### AI Demo

- Nhập "cơm gà"
- Tự động hiện: 450 calo, 25g protein, 60g carbs, 12g fat

---

## 💡 Tips

1. **Thử AI với các món ăn Việt:**
   - cơm gà, phở bò, bánh mì, bún chả, gỏi cuốn
2. **Refresh page:**
   - Data vẫn còn! (khác với demo frontend-only trước đây)
3. **Check database:**

   ```bash
   # Xem database file
   cd backend
   sqlite3 calorie_tracker.db
   # Trong sqlite:
   .tables
   SELECT * FROM users;
   SELECT * FROM food_logs;
   .quit
   ```

4. **API Documentation:**
   - Vào http://localhost:8000/docs
   - Thử trực tiếp các API

---

## 🎓 Next Steps

1. ✅ Chạy demo thành công
2. ⏭️ Đọc code để hiểu cách hoạt động
3. ⏭️ Thêm features mới
4. ⏭️ Tích hợp AI model thật
5. ⏭️ Deploy lên server

---

## 📞 Support

Gặp vấn đề? Kiểm tra:

1. Backend có chạy? → http://localhost:8000
2. Frontend có chạy? → http://localhost:3000
3. Terminal có báo lỗi gì?
4. Đã cài đủ packages? → pip install / npm install

---

**Chúc bạn demo thành công! 🎉**

Mọi thứ đã sẵn sàng, chỉ cần chạy 2 lệnh:

```bash
# Terminal 1:
cd backend && python main.py

# Terminal 2:
npm run dev
```

Enjoy! 🥗
