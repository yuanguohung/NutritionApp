import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Meal, FoodItem } from '../types';
import FoodItemCard from './FoodItemCard';

interface MealCardProps {
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return (
    <View>
      <Text>{meal.name}</Text>
      <FlatList
        data={meal.foodItems}
        renderItem={({ item }) => <FoodItemCard foodItem={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default MealCard;