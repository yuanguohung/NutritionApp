import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define FoodItem and HistoryItem interfaces 
interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface HistoryItem {
  foodItem: FoodItem;
  date: string;
}

const HistoryScreen: React.FC = () => {
  const [filterHistory, setFilterHistory] = useState<HistoryItem[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const historyKey = "foodHistory";

  // Load history from AsyncStorage
  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(historyKey);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        console.log('Stored history:', parsedHistory);

        // Convert data to match HistoryItem format if necessary
        const cleanedHistory = (parsedHistory as (HistoryItem | any)[]).map(item => {
          if (!item.foodItem) {
            // Convert flat data to HistoryItem format
            return {
              foodItem: {
                name: item.name,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fats: item.fats,
              },
              date: item.date,
            };
          }
          return item;
        }).filter((item): item is HistoryItem =>
          item != null &&
          item.foodItem != null &&
          typeof item.foodItem.name === 'string' &&
          typeof item.date === 'string'
        );

        setHistory(cleanedHistory);
        setFilterHistory(cleanedHistory);
        console.log('History loaded and cleaned successfully. Loaded items:', cleanedHistory.length);
      } else {
        setHistory([]);
        setFilterHistory([]);
        console.log('No history found in storage.');
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
      setFilterHistory([]);
      Alert.alert('Lỗi', 'Không thể tải lịch sử dinh dưỡng.');
    }
  };

  // Handle search
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilterHistory(history);
    } else {
      const filtered = history.filter((item: HistoryItem) =>
        item.foodItem?.name?.toLowerCase().includes(text.toLowerCase())
      );
      setFilterHistory(filtered);
    }
  };

  // Delete a single history item
  const deleteHistoryItem = async (itemToDelete: HistoryItem) => {
    try {
      const updatedHistory = history.filter(item => item !== itemToDelete);
      setHistory(updatedHistory);
      setFilterHistory(updatedHistory);
      await AsyncStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      Alert.alert('Thành công', 'Đã xóa mục lịch sử.');
    } catch (error) {
      console.error('Error deleting history item:', error);
      Alert.alert('Lỗi', 'Không thể xóa mục lịch sử.');
    }
  };

  // Clear all history
  const clearHistory = async () => {
    try {
      setHistory([]);
      setFilterHistory([]);
      await AsyncStorage.removeItem(historyKey);
      Alert.alert('Thành công', 'Đã xóa toàn bộ lịch sử.');
    } catch (error) {
      console.error('Error clearing history:', error);
      Alert.alert('Lỗi', 'Không thể xóa toàn bộ lịch sử.');
    }
  };

  // Reload history when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  // Update filtered history when history or searchText changes
  useEffect(() => {
    handleSearch(searchText);
  }, [history, searchText]);

  // Render a single history item
  const renderHistoryItem = useCallback(({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.foodName}>{item.foodItem?.name ?? 'Món ăn không xác định'}</Text>
        <View style={styles.nutritionContainer}>
          <Text style={styles.nutritionText}>Calories: {item.foodItem?.calories ?? 0}</Text>
          <Text style={styles.nutritionText}>Protein: {item.foodItem?.protein ?? 0}g</Text>
          <Text style={styles.nutritionText}>Carbs: {item.foodItem?.carbs ?? 0}g</Text>
          <Text style={styles.nutritionText}>Fats: {item.foodItem?.fats ?? 0}g</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => deleteHistoryItem(item)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="#FF6347" />
      </TouchableOpacity>
    </View>
  ), [history]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      {history.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Xóa toàn bộ lịch sử</Text>
        </TouchableOpacity>
      )}

      {filterHistory.length === 0 && history.length > 0 && searchText !== '' ? (
        <View style={styles.noDataContainer}>
          <Ionicons name="search-outline" size={80} color="#ccc" />
          <Text style={styles.noDataText}>Không tìm thấy kết quả</Text>
        </View>
      ) : filterHistory.length === 0 && history.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Ionicons name="folder-open-outline" size={80} color="#ccc" />
          <Text style={styles.noDataText}>Chưa có lịch sử</Text>
        </View>
      ) : (
        <FlatList
          data={filterHistory}
          keyExtractor={(item: HistoryItem, index) => `${item.date}-${item.foodItem?.name ?? 'unknown'}-${index}`}
          renderItem={renderHistoryItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  historyItemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  nutritionText: {
    fontSize: 14,
    color: '#555',
    marginRight: 15,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
    marginTop: 10,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;