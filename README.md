🍎 NutritionApp
Ứng dụng theo dõi dinh dưỡng hằng ngày được phát triển bằng React Native và Expo, giúp người dùng ghi lại món ăn, lượng nước uống, và theo dõi lịch sử ăn uống.
Giao diện đơn giản, dễ dùng, phù hợp cho mọi đối tượng.

🚀 Tính năng chính

🥗 Ghi nhật ký thực phẩm
➤ Thêm món ăn kèm thông tin dinh dưỡng: calo, protein, carbs, chất béo

☁️ Lưu trữ dữ liệu bằng Firebase Firestore
➤ Bảo mật và truy cập mọi lúc mọi nơi

💾 Hỗ trợ offline với AsyncStorage
➤ Không cần internet vẫn hoạt động mượt

🌟 Đánh dấu yêu thích
➤ Truy cập nhanh các món ăn thường dùng

🎨 Splash screen tùy chỉnh
➤ Màn hình khởi động đẹp mắt, cá nhân hóa

📱 Tải về APK
📦 nutritiontracker.apk
Bạn có thể tải file .apk và cài đặt trực tiếp trên điện thoại Android.

🛠️ Cài đặt & chạy ứng dụng
Yêu cầu:
✅ Node.js >= 14

✅ Expo CLI

✅ Tài khoản Firebase (nếu muốn dùng Firestore)

Cài đặt:
bash
Sao chép
Chỉnh sửa
git clone https://github.com/yuanguohung/NutritionApp.git
cd NutritionApp
npm install
Chạy ứng dụng:
bash
Sao chép
Chỉnh sửa
npx expo start
📱 Mở app Expo Go trên điện thoại và quét mã QR để dùng ngay!

📁 Cấu trúc thư mục
bash
Sao chép
Chỉnh sửa
NutritionApp/
├── app/ # Routing (Expo Router)
├── assets/ # Hình ảnh, icon, splash,...
├── components/ # Các UI component tái sử dụng
├── firebase/ # Cấu hình Firebase
├── navigation/ # Điều hướng chính
├── screens/ # Màn hình Food, Water, History,...
├── services/ # Dịch vụ lưu dữ liệu
├── App.tsx # Điểm khởi đầu
├── app.json # Cấu hình Expo
├── eas.json # Cấu hình EAS Build
└── nutritriontracker.apk # File APK đã build
🔐 Thông tin kỹ thuật
Thành phần Công nghệ
Ngôn ngữ TypeScript
Framework React Native + Expo
Lưu trữ backend Firebase Firestore
Lưu offline AsyncStorage
Build app EAS Build

📸 Giao diện ứng dụng
(Chèn ảnh chụp màn hình hoặc video demo nếu có)

📄 Giấy phép
Dự án được phát hành theo giấy phép MIT.
Nếu bạn có câu hỏi hoặc góp ý, hãy tạo issue tại repo này nhé!
