import React from 'react';
import { View, FlatList } from 'react-native';
import { DailyLog, Meal } from '../types';
import MealCard from './MealCard';

interface DailyLogViewProps {
  dailyLog: DailyLog;
}

const DailyLogView: React.FC<DailyLogViewProps> = ({ dailyLog }) => {
  return (
    <View>
      <FlatList
        data={dailyLog.meals}
        keyExtractor={(item: Meal, index: number) => index.toString()}
        renderItem={({ item }) => <MealCard meal={item} />}
      />
    </View>
  );
};
  
export default DailyLogView;