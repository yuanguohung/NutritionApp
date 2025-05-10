import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { FoodItem } from '../types'; // Adjust the path as necessary

interface FoodItemCardProps {
  foodItem: FoodItem;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ foodItem }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{foodItem.name}</Text>
            <Text>Calories: {foodItem.calories}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { marginBottom: 10 },
    name: { fontWeight: 'bold' },
});

export default FoodItemCard;