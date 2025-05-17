import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FoodScreen from '../screens/FoodScreen';
import { FoodItem } from '../types';
import HistoryScreen from '../screens/HistoryScreen';
import Index from '../app/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WaterScreen from '../screens/WaterScreen';

// Define types for navigation parameters
export type RootStackParamList = {
  Home: undefined;
  HistoryScreen: undefined;
  Food: { addFoodItem: (foodItem: FoodItem) => void };
  Water: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

export const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'HistoryScreen':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Food':
              iconName = focused ? 'fast-food' : 'fast-food-outline';
              break;
            case 'Water':
              iconName = focused ? 'water' : 'water-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingVertical: 5,
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Index} 
        options={{ 
          title: 'Trang chủ',
        }} 
      />
      <Tab.Screen 
        name="HistoryScreen" 
        component={HistoryScreen} 
        options={{ 
          title: 'Lịch sử',
        }} 
      />
      <Tab.Screen 
        name="Food" 
        component={FoodScreen} 
        options={{ 
          title: 'Thực phẩm',
        }} 
      />
      <Tab.Screen 
        name="Water" 
        component={WaterScreen} 
        options={{ 
          title: 'Nước',
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTab;