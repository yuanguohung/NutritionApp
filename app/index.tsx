import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/MainNavigator';
import { ProgressBar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FoodItem {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

interface DailyIntakeData {
    currentCalories: number;
    currentProtein: number;
    currentCarbs: number;
    currentFats: number;
}

interface HistoryItem extends FoodItem {
    date: string;
}

interface UserData {
    weight: string;
    height: string;
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFats: number;
    tdee: number;
}

  
const Index: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'>('sedentary');
    const [targetCalories, setTargetCalories] = useState<number>(0);
    const [targetProtein, setTargetProtein] = useState<number>(0);
    const [targetCarbs, setTargetCarbs] = useState<number>(0);
    const [targetFats, setTargetFats] = useState<number>(0);
    const [tdee, setTDEE] = useState<number>(0);

    const [currentCalories, setCurrentCalories] = useState(0);
    const [currentProtein, setCurrentProtein] = useState(0);
    const [currentCarbs, setCurrentCarbs] = useState(0);
    const [currentFats, setCurrentFats] = useState(0);

    const today = new Date().toISOString().slice(0, 10);
    const historyKey = 'foodHistory';
    const dailyIntakeKey = `dailyIntake:${today}`;
    const userDataKey = 'userData';

    const loadTargetData = async () => {
        try {
            const savedUserData = await AsyncStorage.getItem(userDataKey);
            if (savedUserData) {
                const parsed: UserData = JSON.parse(savedUserData);
                setWeight(parsed.weight);
                setHeight(parsed.height);
                setGender(parsed.gender);
                setActivityLevel(parsed.activityLevel);
                setTargetCalories(parsed.targetCalories);
                setTargetProtein(parsed.targetProtein);
                setTargetCarbs(parsed.targetCarbs);
                setTargetFats(parsed.targetFats);
                setTDEE(parsed.tdee);
            }
        } catch (error) {
            console.error('Error loading target data:', error);
        }
    };
    const logAsyncStorage = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const result = await AsyncStorage.multiGet(keys);
          result.forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
          });
        } catch (e) {
          console.error('Lỗi đọc AsyncStorage:', e);
        }
      };
      useEffect(() => {
        logAsyncStorage();
      }
      , []);

    const saveDailyIntake = async (dataToSave: DailyIntakeData) => {
        try {
            await AsyncStorage.setItem(dailyIntakeKey, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving daily intake:', error);
        }
    };

    const loadDailyIntake = async () => {
        try {
            const savedIntake = await AsyncStorage.getItem(dailyIntakeKey);
            if (savedIntake) {
                const parsed: DailyIntakeData = JSON.parse(savedIntake);
                setCurrentCalories(parsed.currentCalories);
                setCurrentProtein(parsed.currentProtein);
                setCurrentCarbs(parsed.currentCarbs ?? 0);
                setCurrentFats(parsed.currentFats ?? 0);
                console.log('Loaded daily intake:', parsed); // Log giá trị dinh dưỡng đã tải
            }
        } catch (error) {
            console.error('Error loading daily intake:', error);
        }
    };

    const handleAddFoodItem = async (foodItem: FoodItem) => {
        const newCalories = currentCalories + foodItem.calories;
        const newProtein = currentProtein + foodItem.protein;
        const newCarbs = currentCarbs + foodItem.carbs;
        const newFats = currentFats + foodItem.fats;

        setCurrentCalories(newCalories);
        setCurrentProtein(newProtein);
        setCurrentCarbs(newCarbs);
        setCurrentFats(newFats);

        const newHistoryItem: HistoryItem = { ...foodItem, date: today };
        try {
            const storedHistory = await AsyncStorage.getItem(historyKey);
            const history = storedHistory ? JSON.parse(storedHistory) : [];
            history.push(newHistoryItem);
            await AsyncStorage.setItem(historyKey, JSON.stringify(history));
            console.log('Updated history:', history); // Log lịch sử mới
        } catch (error) {
            console.error('Error saving history:', error);
        }

        const dataToSave: DailyIntakeData = {
            currentCalories: newCalories,
            currentProtein: newProtein,
            currentCarbs: newCarbs,
            currentFats: newFats,
        };
        await saveDailyIntake(dataToSave);
        console.log('Updated daily intake:', dataToSave); // Log giá trị dinh dưỡng mới
    };

    const navigateToAddFood = () => {
        navigation.navigate('Food', { addFoodItem: handleAddFoodItem });
    };

    const calculateTDEE = async () => {
        const w = parseFloat(weight);
        const h = parseFloat(height);
        const age = 25;

        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
            Alert.alert('Lỗi', 'Vui lòng nhập cân nặng và chiều cao hợp lệ.');
            return;
        }

        let bmr = gender === 'male'
            ? (10 * w) + (6.25 * h) - (5 * age) + 5
            : (10 * w) + (6.25 * h) - (5 * age) - 161;

        const multiplier = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9,
        }[activityLevel];

        const tdeeValue = Math.round(bmr * multiplier);
        const targetProteinValue = Math.round((tdeeValue * 0.3) / 4);
        const targetCarbsValue = Math.round((tdeeValue * 0.5) / 4);
        const targetFatsValue = Math.round((tdeeValue * 0.2) / 9);

        const userDataToSave: UserData = {
            weight,
            height,
            gender,
            activityLevel,
            targetCalories: tdeeValue,
            targetProtein: targetProteinValue,
            targetCarbs: targetCarbsValue,
            targetFats: targetFatsValue,
            tdee: tdeeValue,
        };

        setTDEE(tdeeValue);
        setTargetCalories(tdeeValue);
        setTargetProtein(targetProteinValue);
        setTargetCarbs(targetCarbsValue);
        setTargetFats(targetFatsValue);

        try {
            await AsyncStorage.setItem(userDataKey, JSON.stringify(userDataToSave));
            Alert.alert('Thành công', `TDEE của bạn là: ${tdeeValue} kcal.`);
        } catch (error) {
            console.error('Error saving target data:', error);
        }
    };

    const handleReset = async () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn đặt lại tất cả các giá trị về 0?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        try {
                            // Reset all current values
                            setCurrentCalories(0);
                            setCurrentProtein(0);
                            setCurrentCarbs(0);
                            setCurrentFats(0);

                            // Reset in AsyncStorage
                            const resetData: DailyIntakeData = {
                                currentCalories: 0,
                                currentProtein: 0,
                                currentCarbs: 0,
                                currentFats: 0,
                            };
                            await saveDailyIntake(resetData);
                            Alert.alert("Thành công", "Đã đặt lại tất cả các giá trị về 0");
                        } catch (error) {
                            console.error('Error resetting data:', error);
                            Alert.alert("Lỗi", "Không thể đặt lại giá trị");
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        loadTargetData();
        loadDailyIntake();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadDailyIntake();
        }, [])
    );

    const proteinProgress = targetProtein > 0 ? currentProtein / targetProtein : 0;
    const carbsProgress = targetCarbs > 0 ? currentCarbs / targetCarbs : 0;
    const fatsProgress = targetFats > 0 ? currentFats / targetFats : 0;
    const caloriesProgress = targetCalories > 0 ? currentCalories / targetCalories : 0;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Tính TDEE & Theo dõi dinh dưỡng</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Cân nặng (kg)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="Ví dụ: 60"
                    />

                    <Text style={styles.label}>Chiều cao (cm)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={height}
                        onChangeText={setHeight}
                        placeholder="Ví dụ: 170"
                    />

                    <Text style={styles.label}>Giới tính</Text>
                    <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
                        <Picker.Item label="Nam" value="male" />
                        <Picker.Item label="Nữ" value="female" />
                    </Picker>

                    <Text style={styles.label}>Mức độ hoạt động</Text>
                    <Picker selectedValue={activityLevel} onValueChange={setActivityLevel} style={styles.picker}>
                        <Picker.Item label="Ít vận động (Rất ít hoặc không tập thể dục)" value="sedentary" />
                        <Picker.Item label="Vận động nhẹ (Tập 1-3 ngày/tuần)" value="light" />
                        <Picker.Item label="Vận động vừa (Tập 3-5 ngày/tuần)" value="moderate" />
                        <Picker.Item label="Vận động nhiều (Tập 6-7 ngày/tuần)" value="active" />
                        <Picker.Item label="Vận động rất nhiều (Tập nặng hàng ngày hoặc làm công việc chân tay nặng nhọc)" value="veryActive" />
                    </Picker>

                    <TouchableOpacity style={styles.button} onPress={calculateTDEE}>
                        <Text style={styles.buttonText}>Tính TDEE và Mục tiêu</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Mục tiêu hàng ngày: {targetCalories} kcal (TDEE)</Text>
                    <Text>Protein: {currentProtein}/{targetProtein}g</Text>
                    <ProgressBar progress={proteinProgress} color="#4caf50" style={styles.progress} />

                    <Text>Carbs: {currentCarbs}/{targetCarbs}g</Text>
                    <ProgressBar progress={carbsProgress} color="#2196f3" style={styles.progress} />

                    <Text>Fats: {currentFats}/{targetFats}g</Text>
                    <ProgressBar progress={fatsProgress} color="#ff9800" style={styles.progress} />

                    <Text>Calories: {currentCalories}/{targetCalories} kcal</Text>
                    <ProgressBar progress={caloriesProgress} color="#f44336" style={styles.progress} />
                    
                </View>

                <TouchableOpacity style={styles.button} onPress={navigateToAddFood}>
                    <Text style={styles.buttonText}>Thêm món ăn</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                    <Text style={styles.resetButtonText}>Đặt lại giá trị</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    label: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginTop: 4,
        fontSize: 16,
    },
    picker: {
        backgroundColor: '#f9f9f9',
        marginTop: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resetButton: {
        backgroundColor: '#f44336',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    progress: {
        height: 8,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: '#eee',
    },
});