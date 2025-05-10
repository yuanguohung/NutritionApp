export interface FoodItem {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    imageUri?: string | null;
}

export interface Meal {
    name: string;
    foodItems: FoodItem[];
}

export interface DailyLog {
    meals: Meal[];
    date: string;
}

export interface NewHistoryItem {
    date: string;
    foodItem: FoodItem;
}
export interface WaterLog {
    date: string;       
    totalWater: number; 
}

