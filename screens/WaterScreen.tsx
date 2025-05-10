import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';

const DAILY_GOAL = 2000;

const getTodayKey = () => {
  const today = new Date();
  return `water_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const WaterScreen: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [todayKey, setTodayKey] = useState(getTodayKey());

  useEffect(() => {
    const key = getTodayKey();
    setTodayKey(key);
    loadWaterData(key);
  }, []);

  const loadWaterData = async (key: string) => {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) setTotal(parseInt(stored, 10));
      else setTotal(0); // Nếu chưa có dữ liệu hôm nay
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu nước:', e);
    }
  };

  const saveWaterData = async (key: string, newTotal: number) => {
    try {
      await AsyncStorage.setItem(key, newTotal.toString());
    } catch (e) {
      console.error('Lỗi khi lưu dữ liệu nước:', e);
    }
  };

  const handleAddWater = () => {
    const value = parseInt(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số ml hợp lệ.');
      return;
    }

    const updatedTotal = total + value;
    setTotal(updatedTotal);
    setAmount('');
    saveWaterData(todayKey, updatedTotal);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Theo dõi lượng nước</Text>
      <Text style={styles.date}>{todayKey.replace('water_', '')}</Text>
      <Text style={styles.total}>
        <Text style={styles.highlight}>{total}</Text> / {DAILY_GOAL} ml
      </Text>

      <View style={styles.progressContainer}>
        <ProgressBar
          progress={total / DAILY_GOAL}
          color="#4CAF50"
          style={styles.progressBar}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nhập ml (vd: 250)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddWater}>
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0288D1',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  highlight: {
    color: '#0288D1',
    fontSize: 24,
  },
  progressContainer: {
    marginVertical: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#B3E5FC',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0288D1',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#0288D1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WaterScreen;
