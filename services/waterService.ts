import { db } from '../firebase/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';

interface WaterLog {
  amount: number;
  timestamp: number;
}

interface WaterData {
  total: number;
  logs: WaterLog[];
  date: string;
  userId?: string;
}

export const waterService = {
  async saveWaterData(data: WaterData) {
    try {
      const watersRef = collection(db, 'waters');
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Check if today's record exists
      const q = query(watersRef, where('date', '==', todayStr));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing record
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(db, 'waters', docId);
        await updateDoc(docRef, { ...data });
        return docId;
      } else {
        // Create new record
        const docRef = await addDoc(watersRef, {
          ...data,
          date: todayStr,
          createdAt: new Date().toISOString()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu nước:', error);
      throw error;
    }
  },

  async getTodayWaterData(): Promise<WaterData | null> {
    try {
      const watersRef = collection(db, 'waters');
      const todayStr = new Date().toISOString().split('T')[0];
      const q = query(watersRef, where('date', '==', todayStr));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data() as WaterData;
        return data;
      }
      return null;
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu nước:', error);
      throw error;
    }
  }
};