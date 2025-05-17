import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FoodScreen from '../screens/FoodScreen';
import { FoodItem } from '../types';
import HistoryScreen from '../screens/HistoryScreen';
import Index from '../app/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WaterScreen from '../screens/WaterScreen';

export type RootStackParamList = { 
  Home: undefined; 
  HistoryScreen: undefined; 
  Food: { addFoodItem: (foodItem: FoodItem) => void }; 
  Water: undefined;

};

const Tab = createBottomTabNavigator<RootStackParamList>();
export const BottomTab = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'HistoryScreen') {
          iconName = 'time-outline';
        } else if (route.name === 'Food') {
          iconName = 'fast-food-outline';
        } else if (route.name === 'Water') {
          iconName = 'water-outline'; // 🌊 biểu tượng liên quan nước
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={Index} options={{ title: 'Trang chủ' }} />
    <Tab.Screen name="HistoryScreen" component={HistoryScreen} options={{ title: 'Lịch sử' }} />
    <Tab.Screen name="Food" component={FoodScreen} options={{ title: 'Thực phẩm' }} />
    <Tab.Screen name="Water" component={WaterScreen} options={{ title: 'Nước' }} />
  </Tab.Navigator>
);
