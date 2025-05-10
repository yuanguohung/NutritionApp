# 🥗 NutritionApp

Ứng dụng theo dõi dinh dưỡng hằng ngày được phát triển bằng **React Native** và **Expo**, cho phép người dùng ghi lại thực phẩm đã ăn, lượng nước uống, và xem lịch sử ăn uống. Giao diện được thiết kế đơn giản, trực quan và dễ sử dụng.

## 🚀 Tính Năng

- ✅ **Theo dõi thực phẩm hàng ngày**: Hiển thị danh sách món ăn kèm thông tin dinh dưỡng.
- 💧 **Theo dõi lượng nước uống**.
- 🕓 **Lịch sử ăn uống**: Xem lại nhật ký các ngày trước đó.
- 🎨 Giao diện hiện đại, responsive.
- 🗂️ Lưu trữ dữ liệu bằng Async Storage (hoặc Firebase nếu tích hợp thêm).
- 🔢 **Tính TDEE (Tổng năng lượng tiêu hao mỗi ngày)**: Giúp người dùng ước lượng lượng calo cần thiết dựa trên chiều cao, cân nặng và mức độ vận động.

## 🛠️ Công Nghệ

- React Native + Expo
- TypeScript
- React Navigation
- Async Storage
- Custom Font (SpaceMono)
- Modular Component Architecture

## 📁 Cấu Trúc Thư Mục

```
NUTRITIONAPP/
├── app/                      # Thư mục chính cho routing với Expo Router
│   ├── _layout.tsx
│   └── index.tsx
├── assets/                   # Chứa hình ảnh, font, v.v.
│
├── components/               # Các thành phần giao diện tái sử dụng
│   ├── DailyLogView.tsx
│   ├── FoodItemCard.tsx
│   └── MealCard.tsx
│
├── fonts/                    # Font tùy chỉnh
│   └── SpaceMono-Regular.ttf
│
├── images/                   # Hình ảnh sử dụng trong app
│
├── navigation/               # Điều hướng (navigation stack/tab)
│   └── MainNavigator.tsx
│
├── screens/                  # Các màn hình chính
│   ├── FoodScreen.tsx
│   ├── HistoryScreen.tsx
│   └── WaterScreen.tsx
│
├── App.tsx                   # File chính khởi động ứng dụng
├── app.json                  # Cấu hình cho Expo
├── .gitignore
```

## ▶️ Demo

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)

_(Chèn link Google Drive hoặc YouTube demo nếu có)_

## 👨‍💻 Tác Giả

- **Nguyễn Quốc Hùng** – Đồ án cá nhân

## 📝 Cài Đặt

```bash
git clone repo
cd nutritionapp
npm install
npx expo start
```

## 📌 Ghi Chú

- Cần cài **Expo Go** trên điện thoại để test trực tiếp.
- Hỗ trợ Android và iOS.
- Font `SpaceMono` cần được load trước khi render App.

---
