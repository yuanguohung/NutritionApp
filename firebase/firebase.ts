// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACCOHMs0kFZFhca5ZtO_rexlLVEaAah4s",
  authDomain: "nutritiontracker-8c86c.firebaseapp.com",
  projectId: "nutritiontracker-8c86c",
  storageBucket: "nutritiontracker-8c86c.firebasestorage.app",
  messagingSenderId: "196835336278",
  appId: "1:196835336278:web:c86a9ca1f65ec539ff1bf7",
  measurementId: "G-NDPE5CE89P"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
