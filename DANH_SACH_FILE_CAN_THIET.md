# 📋 DANH SÁCH FILE CẦN THIẾT ĐỂ CHẠY LOCAL DEMO

## ✅ CÁC FILE/THƯ MỤC CẦN THIẾT (BẮT BUỘC PUSH LÊN GITHUB)

### 📁 Files cấu hình gốc (Root level)

- ✅ `package.json` - Chứa danh sách dependencies và scripts
- ✅ `vite.config.ts` - Cấu hình Vite bundler
- ✅ `tsconfig.json` - Cấu hình TypeScript
- ✅ `tsconfig.node.json` - Cấu hình TypeScript cho Vite
- ✅ `index.html` - File HTML chính
- ✅ `README.md` - Hướng dẫn về project
- ✅ `.gitignore` - Danh sách file/folder cần ignore

### 📁 Thư mục src/ (Toàn bộ source code)

- ✅ `src/main.tsx` - Entry point của ứng dụng
- ✅ `src/App.tsx` - Component chính
- ✅ `src/App.css` - CSS cho App component
- ✅ `src/index.css` - CSS global với Tailwind và Bootstrap
- ✅ `src/Attributions.md` - Thông tin attribution

### 📁 Thư mục src/components/ (Các component screens)

- ✅ `src/components/WelcomeScreen.tsx`
- ✅ `src/components/LoginScreen.tsx`
- ✅ `src/components/SignupScreen.tsx`
- ✅ `src/components/SetupProfileScreen.tsx`
- ✅ `src/components/GoalSelectionScreen.tsx`
- ✅ `src/components/DashboardScreen.tsx`
- ✅ `src/components/QuickLogScreen.tsx`
- ✅ `src/components/ManualLogScreen.tsx`
- ✅ `src/components/PicLogScreen.tsx`
- ✅ `src/components/MealPlanScreen.tsx`
- ✅ `src/components/ProfileScreen.tsx`
- ✅ `src/components/SettingsScreen.tsx`
- ✅ `src/components/BottomNav.tsx`

### 📁 Thư mục src/components/figma/

- ✅ `src/components/figma/ImageWithFallback.tsx`

### 📁 Thư mục src/components/ui/ (Toàn bộ UI components)

- ✅ Tất cả các file .tsx trong folder này (accordion.tsx, alert.tsx, button.tsx, etc.)
- ✅ `src/components/ui/utils.ts`
- ✅ `src/components/ui/use-mobile.ts`

### 📁 Thư mục src/guidelines/

- ✅ `src/guidelines/Guidelines.md`

### 📁 Thư mục src/styles/

- ✅ `src/styles/globals.css` (nếu có)

---

## ❌ CÁC FILE/THƯ MỤC KHÔNG CẦN (ĐÃ ĐƯỢC IGNORE)

- ❌ `node_modules/` - Sẽ được cài lại bằng `npm install`
- ❌ `package-lock.json` - Sẽ được tạo tự động khi `npm install`
- ❌ `build/` hoặc `dist/` - Output sau khi build
- ❌ `.env` files - Các file môi trường
- ❌ `*.zip` files - File nén
- ❌ `.vscode/` - Editor settings (trừ extensions.json nếu cần)
- ❌ `*.log` - Log files

---

## 🚀 HƯỚNG DẪN CHẠY LOCAL DEMO

### Bước 1: Clone repository từ GitHub

```bash
git clone <repository-url>
cd Test
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Chạy development server

```bash
npm run dev
```

### Bước 4: Mở trình duyệt

- Truy cập: `http://localhost:3000/`
- App sẽ tự động mở trong trình duyệt

---

## 📦 BUILD CHO PRODUCTION

Để build ứng dụng cho production:

```bash
npm run build
```

File build sẽ được tạo trong folder `build/`

---

## 🎯 TỔNG KẾT

### Tổng số file cần thiết:

- **Files cấu hình:** 7 files
- **Source code:** ~50+ files
- **Tổng dung lượng:** ~500KB (không tính node_modules)

### Sau khi push lên GitHub:

- Người khác chỉ cần clone về
- Chạy `npm install` để cài dependencies
- Chạy `npm run dev` để xem demo
- **Không cần** file nén .zip
- **Không cần** folder node_modules

---

## 📝 GHI CHÚ

1. File `.gitignore` đã được tạo để tự động loại bỏ các file không cần thiết
2. Khi commit lên Git, chỉ các file cần thiết sẽ được push
3. Dung lượng repository sẽ nhẹ (~500KB thay vì vài trăm MB với node_modules)
4. Mọi người clone về đều có thể chạy được bằng cách `npm install` và `npm run dev`

---

## ✨ DEMO ĐÃ CHẠY THÀNH CÔNG

App đang chạy tại: **http://localhost:3000/**

Features hoạt động:

- ✅ Welcome screen với gradient background
- ✅ Login/Signup flow
- ✅ Profile setup và goal selection
- ✅ Dashboard với calorie tracking
- ✅ Quick log, Manual log, Pic log
- ✅ Meal plan screen
- ✅ Profile và Settings
- ✅ Bottom navigation
- ✅ Responsive design (mobile-first)
