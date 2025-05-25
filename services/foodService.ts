import { db } from '../firebase/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { FoodItem } from '../types';

export const foodService = {
  async addFood(foodItem: FoodItem) {
    try {
      const foodData = {
        name: foodItem.name,
        calories: Number(foodItem.calories),
        protein: Number(foodItem.protein),
        carbs: Number(foodItem.carbs),
        fats: Number(foodItem.fats),
        imageUri: foodItem.imageUri || null, // Lưu đường dẫn local
        isFavorite: false,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'foods'), foodData);
      return { 
        ...foodData,
        id: docRef.id 
      };
    } catch (error) {
      console.error('Lỗi khi thêm món ăn:', error);
      throw error;
    }
  },

  async getAllFoods() {
    try {
      const querySnapshot = await getDocs(collection(db, 'foods'));
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as Omit<FoodItem, 'id'>;
        return {
          id: docSnap.id,
          ...data
        };
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách món ăn:', error);
      throw error;
    }
  },

  async updateFood(foodId: string, foodItem: FoodItem) {
    try {
      const foodRef = doc(db, 'foods', foodId);
      const foodData = {
        name: foodItem.name,
        calories: Number(foodItem.calories),
        protein: Number(foodItem.protein),
        carbs: Number(foodItem.carbs),
        fats: Number(foodItem.fats),
        imageUri: foodItem.imageUri || null,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(foodRef, foodData);
      return {
        ...foodItem,
        id: foodId
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật món ăn:', error);
      throw error;
    }
  },

  async deleteFood(foodId: string) {
    try {
      await deleteDoc(doc(db, 'foods', foodId));
    } catch (error) {
      console.error('Lỗi khi xóa món ăn:', error);
      throw error;
    }
  }
};