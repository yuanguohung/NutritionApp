import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DAILY_GOAL = 2000; // ml
const WATER_STORAGE_PREFIX = 'water_';
const PRESET_AMOUNTS = [100, 200, 250, 500]; // Giá trị nhanh

interface WaterLog {
  amount: number;
  timestamp: number;
}

const WaterScreen: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [todayKey, setTodayKey] = useState('');
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [progressAnimation] = useState(new Animated.Value(0));

  // Lấy key cho ngày hiện tại
  const getTodayKey = () => {
    const today = new Date();
    return `${WATER_STORAGE_PREFIX}${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    const key = getTodayKey();
    setTodayKey(key);
    loadWaterData(key);
  }, []);

  // Animation cho progress bar
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: total / DAILY_GOAL,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [total]);

  // Load dữ liệu từ storage
  const loadWaterData = async (key: string) => {
    try {
      const storedData = await AsyncStorage.getItem(key);
      if (storedData) {
        const data = JSON.parse(storedData);
        setTotal(data.total);
        setWaterLogs(data.logs);
      } else {
        setTotal(0);
        setWaterLogs([]);
      }
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu:', e);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu nước uống');
    }
  };

  // Lưu dữ liệu vào storage
  const saveWaterData = async (newTotal: number, newLogs: WaterLog[]) => {
    try {
      const data = {
        total: newTotal,
        logs: newLogs,
      };
      await AsyncStorage.setItem(todayKey, JSON.stringify(data));
    } catch (e) {
      console.error('Lỗi khi lưu dữ liệu:', e);
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu nước uống');
    }
  };

  // Xử lý thêm nước
  const handleAddWater = (value: number) => {
    const newTotal = total + value;
    const newLog: WaterLog = {
      amount: value,
      timestamp: Date.now(),
    };
    const newLogs = [...waterLogs, newLog];

    setTotal(newTotal);
    setWaterLogs(newLogs);
    setAmount('');
    saveWaterData(newTotal, newLogs);

    // Thông báo khi đạt mục tiêu
    if (total < DAILY_GOAL && newTotal >= DAILY_GOAL) {
      Alert.alert('Chúc mừng! 🎉', 'Bạn đã đạt mục tiêu uống nước hôm nay!');
    }
  };

  // Reset dữ liệu
  const handleReset = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa toàn bộ dữ liệu hôm nay?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(todayKey);
              setTotal(0);
              setWaterLogs([]);
            } catch (e) {
              console.error('Lỗi khi xóa dữ liệu:', e);
              Alert.alert('Lỗi', 'Không thể xóa dữ liệu');
            }
          }
        }
      ]
    );
  };

  // Format thời gian
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💧 Theo dõi nước uống</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh" size={24} color="#0288D1" />
        </TouchableOpacity>
      </View>

      <Text style={styles.date}>
        {new Date().toLocaleDateString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>

      <View style={styles.statsContainer}>
        <Text style={styles.total}>
          <Text style={styles.highlight}>{total}</Text> / {DAILY_GOAL} ml
        </Text>
        <Text style={styles.percentage}>
          {Math.round((total / DAILY_GOAL) * 100)}%
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar
          progress={total / DAILY_GOAL}
          color="#4CAF50"
          style={styles.progressBar}
        />
      </View>

      <View style={styles.presetContainer}>
        {PRESET_AMOUNTS.map((presetAmount) => (
          <TouchableOpacity
            key={presetAmount}
            style={styles.presetButton}
            onPress={() => handleAddWater(presetAmount)}
          >
            <Text style={styles.presetButtonText}>+{presetAmount}ml</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nhập số ml..."
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            const value = parseInt(amount);
            if (!isNaN(value) && value > 0) {
              handleAddWater(value);
            } else {
              Alert.alert('Lỗi', 'Vui lòng nhập số ml hợp lệ');
            }
          }}
        >
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Lịch sử uống nước</Text>
        {waterLogs.map((log, index) => (
          <View key={index} style={styles.logItem}>
            <Text style={styles.logTime}>{formatTime(log.timestamp)}</Text>
            <Text style={styles.logAmount}>+{log.amount}ml</Text>
          </View>
        )).reverse()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0288D1',
  },
  resetButton: {
    padding: 10,
  },
  date: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  percentage: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  highlight: {
    color: '#0288D1',
    fontSize: 24,
  },
  progressContainer: {
    marginHorizontal: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#B3E5FC',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
  },
  presetButton: {
    backgroundColor: '#81D4FA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  presetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  logContainer: {
    padding: 20,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B3E5FC',
  },
  logTime: {
    color: '#666',
  },
  logAmount: {
    color: '#0288D1',
    fontWeight: 'bold',
  },
});

export default WaterScreen;