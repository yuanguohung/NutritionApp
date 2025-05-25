# 🥗 NutritionApp

Ứng dụng theo dõi dinh dưỡng hằng ngày được phát triển bằng React Native và Expo. Giúp người dùng ghi lại thông tin dinh dưỡng và theo dõi chế độ ăn uống một cách dễ dàng.

## ✨ Tính năng chính

### 📝 Quản lý thực phẩm

- Thêm/sửa/xóa món ăn
- Theo dõi calories, protein, carbs, chất béo
- Đánh dấu món ăn yêu thích
- Tìm kiếm món ăn nhanh chóng

### 💧 Theo dõi nước uống

- Ghi lại lượng nước uống hàng ngày
- Đặt mục tiêu nước uống
- Xem thống kê theo ngày/tuần

### 📊 Thống kê & Báo cáo

- Xem lịch sử ăn uống
- Biểu đồ dinh dưỡng trực quan
- Phân tích chế độ ăn dựa trên kết quả TDEE Calculator

### 🔄 Đồng bộ dữ liệu

- Lưu trữ trên Firebase Firestore
- Hỗ trợ sử dụng offline với AsyncStorage
- Đồng bộ tự động khi có internet

## 🚀 Cài đặt

### Yêu cầu hệ thống

- Node.js >= 14
- Expo CLI
- Tài khoản Firebase (để sử dụng Firestore)

### Các bước cài đặt

1. Clone repository:

```bash
git clone https://github.com/yuanguohung/NutritionApp.git
cd NutritionApp
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Chạy ứng dụng:

```bash
npx expo start
```

4. Quét mã QR bằng Expo Go trên điện thoại để chạy app

## 📱 Tải về

Bạn có thể tải trực tiếp file APK và cài đặt trên Android:
[Download nutritiontracker.apk](https://github.com/yuanguohung/NutritionApp/blob/main/nutritriontracker.apk)

## 🗂️ Cấu trúc project

```
NutritionApp/
├── app/                  # Routing (Expo Router)
├── assets/              # Images, icons, splash screens
│   └── images/          # App images
├── components/          # Reusable UI components
├── firebase/           # Firebase configuration
├── navigation/         # Navigation setup
├── screens/            # Main app screens
├── services/           # Data & business logic
└── types/             # TypeScript definitions
```

## 🛠️ Công nghệ sử dụng

- **Frontend:** React Native, Expo
- **Backend:** Firebase Firestore
- **Language:** TypeScript
- **Storage:** AsyncStorage
- **Build:** EAS Build

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:

1. Fork project
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📧 Liên hệ

YuanGuoHung - [@yuanguohung](https://github.com/yuanguohung)

Project Link: [https://github.com/yuanguohung/NutritionApp](https://github.com/yuanguohung/NutritionApp)
