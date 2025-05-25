import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal, Button, TouchableWithoutFeedback, Alert, Image, ScrollView } from 'react-native';
import { foodData } from '../foodData';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { foodService } from '../services/foodService';

interface FoodItem {
    id?: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    isFavorite?: boolean;
    imageUri?: string | null;
}

const FoodScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const route = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { addFoodItem = () => {} } = route.params as { addFoodItem?: (foodItem: FoodItem) => void } || {};

    const [staticFoodData] = useState<FoodItem[]>(foodData);
    const [customFoodData, setCustomFoodData] = useState<FoodItem[]>([]);
    const [favoriteStaticFoodNames, setFavoriteStaticFoodNames] = useState<string[]>([]);
    const [displayedFoodData, setDisplayedFoodData] = useState<FoodItem[]>([]);

    const CUSTOM_FOOD_STORAGE_KEY = '@MyApp:customFoodData';
    const FAVORITE_STATIC_STORAGE_KEY = '@MyApp:favoriteStaticFood';

    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [newFoodItem, setNewFoodItem] = useState<FoodItem>({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [editingFoodItem, setEditingFoodItem] = useState<FoodItem | null>(null);

    const saveCustomFoodData = async (dataToSave: FoodItem[]) => {
        try {
            await AsyncStorage.setItem(CUSTOM_FOOD_STORAGE_KEY, JSON.stringify(dataToSave));
            console.log('Custom food data saved.');
        } catch (error) {
            console.error('Failed to save custom food data:', error);
        }
    };

    const saveFavoriteStaticFoodNames = async (dataToSave: string[]) => {
        try {
            await AsyncStorage.setItem(FAVORITE_STATIC_STORAGE_KEY, JSON.stringify(dataToSave));
            console.log('Favorited static food names saved.');
        } catch (error) {
            console.error('Failed to save favorited static food names:', error);
        }
    };

    const loadData = async () => {
        try {
            // Load from Firestore
            const firestoreFoods = await foodService.getAllFoods();
            
            // Load favorite static foods from AsyncStorage
            const storedFavoriteStatic = await AsyncStorage.getItem(FAVORITE_STATIC_STORAGE_KEY);
            const loadedFavoriteStatic = storedFavoriteStatic ? JSON.parse(storedFavoriteStatic) : [];
            setFavoriteStaticFoodNames(loadedFavoriteStatic);

            // Combine static and Firestore data
            const staticDataWithFavorites = staticFoodData.map(item => ({
                ...item,
                isFavorite: loadedFavoriteStatic.includes(item.name),
            }));

            const combinedDataWithFavorites = [
                ...staticDataWithFavorites,
                ...firestoreFoods
            ];

            setCustomFoodData(firestoreFoods);
            setDisplayedFoodData(combinedDataWithFavorites);

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách món ăn. Vui lòng thử lại sau.');
            
            // Fallback to static data if failed
            const staticDataWithoutFavorites = staticFoodData.map(item => ({
                ...item,
                isFavorite: false,
            }));
            setDisplayedFoodData(staticDataWithoutFavorites);
        }
    };

    const handleAddFood = async () => {
        if (!newFoodItem.name || newFoodItem.calories <= 0) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn và lượng calo hợp lệ.');
            return;
        }

        try {
            const foodToAdd: FoodItem = {
                name: newFoodItem.name,
                calories: Number(newFoodItem.calories),
                protein: Number(newFoodItem.protein),
                carbs: Number(newFoodItem.carbs),
                fats: Number(newFoodItem.fats),
                imageUri: newFoodItem.imageUri || null,
                isFavorite: false
            };

            // Lưu vào Firestore
            const savedFood = await foodService.addFood(foodToAdd);
            
            // Cập nhật state local
            setCustomFoodData(prevData => [...prevData, savedFood]);
            setDisplayedFoodData(prevData => [...prevData, savedFood]);

            Alert.alert('Thành công', `Đã thêm "${savedFood.name}" vào danh sách.`);
            setAddModalVisible(false);
            setNewFoodItem({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
        } catch (error) {
            console.error('Lỗi khi thêm món ăn:', error);
            Alert.alert('Lỗi', 'Không thể thêm món ăn. Vui lòng thử lại sau.');
        }
    };

    const handleEditFood = (foodItem: FoodItem) => {
         if (!foodItem.id) {
             console.warn('Attempted to edit a food item without an ID (likely static).');
             Alert.alert('Thông tin', 'Bạn chỉ có thể sửa các món ăn do bạn tự thêm.');
             return;
         }
        setEditingFoodItem(foodItem);
        setNewFoodItem({...foodItem});
        setEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!newFoodItem.name || newFoodItem.calories <= 0 || !editingFoodItem) {
             Alert.alert('Lỗi', 'Thông tin món ăn không hợp lệ.');
            return;
        }

        try {
            // Update in Firebase
            const updatedFood = await foodService.updateFood(editingFoodItem.id!, newFoodItem);
            
            // Update local state
            const updatedCustomFood = customFoodData.map(item =>
                item.id === editingFoodItem.id ? updatedFood : item
            );
            setCustomFoodData(updatedCustomFood);

            // Update AsyncStorage
            await saveCustomFoodData(updatedCustomFood);

            Alert.alert('Thành công', `Đã cập nhật "${updatedFood.name}".`);
            setEditModalVisible(false);
            setEditingFoodItem(null);
            setNewFoodItem({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
        } catch (error) {
            console.error('Error updating food:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật món ăn. Vui lòng thử lại sau.');
        }
    };

    const handleDeleteFood = async (foodItem: FoodItem) => {
        if (!foodItem.id) {
            Alert.alert('Thông tin', 'Không thể xóa món ăn này.');
            return;
        }

        Alert.alert(
            'Xóa món ăn',
            `Bạn có chắc chắn muốn xóa "${foodItem.name}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Delete from Firebase
                            await foodService.deleteFood(foodItem.id!);
                            
                            // Update local state
                            const updatedCustomFood = customFoodData.filter(item => item.id !== foodItem.id);
                            setCustomFoodData(updatedCustomFood);
                            
                            // Update AsyncStorage
                            await saveCustomFoodData(updatedCustomFood);
                            
                            Alert.alert('Thành công', `Đã xóa "${foodItem.name}".`);
                        } catch (error) {
                            console.error('Error deleting food:', error);
                            Alert.alert('Lỗi', 'Không thể xóa món ăn. Vui lòng thử lại sau.');
                        }
                    },
                },
            ]
        );
    };

    const handleToggleFavorite = async (itemToToggle: FoodItem) => {
         const isCurrentlyFavorite = itemToToggle.isFavorite || false;

         if (itemToToggle.id) {
             const updatedCustomFood = customFoodData.map(item =>
                 item.id === itemToToggle.id ? { ...item, isFavorite: !isCurrentlyFavorite } : item
             );
             setCustomFoodData(updatedCustomFood);
             await saveCustomFoodData(updatedCustomFood);
         } else {
             const staticItemName = itemToToggle.name;
             const updatedFavoriteStatic = isCurrentlyFavorite
                 ? favoriteStaticFoodNames.filter(name => name !== staticItemName)
                 : [...favoriteStaticFoodNames, staticItemName];

             setFavoriteStaticFoodNames(updatedFavoriteStatic);
             await saveFavoriteStaticFoodNames(updatedFavoriteStatic);
         }

         Alert.alert('Trạng thái yêu thích', `"${itemToToggle.name}" đã được ${isCurrentlyFavorite ? 'xóa khỏi' : 'thêm vào'} danh sách yêu thích.`);
     };

    const handleFoodItemPress = useCallback((foodItem: FoodItem) => {
         const itemToAdd: FoodItem = {
             name: foodItem.name,
             calories: foodItem.calories,
             protein: foodItem.protein,
             carbs: foodItem.carbs,
             fats: foodItem.fats,
         };
        addFoodItem(itemToAdd);
        Alert.alert('Đã thêm!', `Đã thêm ${itemToAdd.name} vào nhật ký dinh dưỡng.`);
    }, [addFoodItem]);

    const handleSelectImage = async () => {
        // Xin quyền truy cập thư viện ảnh
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Quyền truy cập bị từ chối', 'Cần quyền truy cập thư viện ảnh để chọn ảnh.');
            return;
        }
    
        // Mở trình chọn ảnh
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chỉ cho phép chọn ảnh
            allowsEditing: false, // true nếu muốn chỉnh sửa ảnh cơ bản (cắt, xoay)
            quality: 1, // Chất lượng ảnh (0 đến 1)
        });
    
        console.log('Image picker result:', result); // Log kết quả để debug nếu cần
    
        // Kiểm tra nếu người dùng không hủy và có ảnh được chọn
        if (!result.canceled && result.assets && result.assets.length > 0) {
             const selectedAsset = result.assets[0]; // Truy cập đúng thuộc tính assets
             setNewFoodItem(prev => ({
                ...prev,
                imageUri: selectedAsset.uri // Cập nhật state với URI của ảnh đã chọn
            }));
            console.log('Selected image URI:', selectedAsset.uri);
        } else {
             console.log('Image selection cancelled or failed.');
        }
    };
    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const staticDataWithFavorites = staticFoodData.map(item => ({
             ...item,
             isFavorite: favoriteStaticFoodNames.includes(item.name),
         }));

         const customDataCleaned = customFoodData.map(item => ({
              ...item,
              isFavorite: item.isFavorite ?? false,
          }));

        const combinedData = staticDataWithFavorites.concat(customDataCleaned);

        const filteredData = combinedData.filter(foodItem =>
            foodItem.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

         const sortedData = filteredData.sort((a, b) => {
             if ((a.isFavorite ?? false) && !(b.isFavorite ?? false)) return -1;
             if (!(a.isFavorite ?? false) && (b.isFavorite ?? false)) return 1;
             return a.name.localeCompare(b.name);
         });

        setDisplayedFoodData(sortedData);

    }, [customFoodData, searchQuery, staticFoodData, favoriteStaticFoodNames]);

    const handleSearchQueryChange = (text: string) => {
        setSearchQuery(text);
    };

    const renderItem = useCallback(({ item: foodItem }: { item: FoodItem }) => {
        const isCustom = foodItem.id !== undefined;
        const isFavorite = foodItem.isFavorite || false;

        return (
            <View style={styles.itemContainer}>
                {foodItem.imageUri && (
                    <Image 
                        source={{ uri: foodItem.imageUri }} 
                        style={styles.itemImage}
                    />
                )}
                <TouchableOpacity
                     onPress={() => handleFoodItemPress(foodItem)}
                     style={styles.foodItemContent}
                >
                    <Text style={styles.name}>{foodItem.name}</Text>
                    <Text>Calories: {foodItem.calories}</Text>
                    <Text>Protein: {foodItem.protein}g</Text>
                    <Text>Carbs: {foodItem.carbs}g</Text>
                    <Text>Fats: {foodItem.fats}g</Text>
                </TouchableOpacity>

                 <TouchableOpacity
                     onPress={() => handleToggleFavorite(foodItem)}
                     style={styles.favoriteButton}
                 >
                     <Ionicons
                         name={isFavorite ? "heart" : "heart-outline"}
                         size={24}
                         color={isFavorite ? "#FF6347" : "#666"}
                     />
                 </TouchableOpacity>

                {isCustom && (
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity
                             onPress={() => handleEditFood(foodItem)}
                             style={[styles.actionButton, { backgroundColor: '#FFC107', marginRight: 8 }]}
                        >
                            <Ionicons name="create-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                             onPress={() => Alert.alert(
                                 'Xác nhận xóa',
                                 `Bạn có chắc chắn muốn xóa "${foodItem.name}"?`,
                                 [
                                     { text: 'Hủy', style: 'cancel' },
                                     { text: 'Xóa', style: 'destructive', onPress: () => handleDeleteFood(foodItem) }
                                 ]
                             )}
                            style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                        >
                             <Ionicons name="trash-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }, [handleFoodItemPress, handleToggleFavorite, handleEditFood, handleDeleteFood]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Tìm món ăn"
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
            />

            <FlatList
                data={displayedFoodData}
                keyExtractor={(item, index) => item.id ? item.id.toString() : item.name + index.toString()}
                renderItem={renderItem}
                 ListEmptyComponent={() => (
                     <View style={styles.noDataContainer}>
                         <Text style={styles.noDataText}>Không tìm thấy món ăn nào.</Text>
                     </View>
                 )}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddModalVisible}
                onRequestClose={() => {
                    setAddModalVisible(false);
                    setNewFoodItem({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        setAddModalVisible(false);
                        setNewFoodItem({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
                    }}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={styles.modalContent}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={styles.modalTitle}>Thêm món ăn mới</Text>

                                    <View style={styles.imageContainer}>
                                        {newFoodItem.imageUri ? (
                                            <Image 
                                                source={{ uri: newFoodItem.imageUri }} 
                                                style={styles.foodImage} 
                                            />
                                        ) : (
                                            <View style={styles.placeholderImage}>
                                                <Ionicons name="image-outline" size={40} color="#666" />
                                            </View>
                                        )}
                                        <TouchableOpacity 
                                            style={styles.selectImageButton}
                                            onPress={handleSelectImage}
                                        >
                                            <Text style={styles.selectImageText}>
                                                {newFoodItem.imageUri ? 'Đổi ảnh' : 'Chọn ảnh'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Tên món ăn"
                                        value={newFoodItem.name}
                                        onChangeText={(text) => setNewFoodItem({ ...newFoodItem, name: text })}
                                    />
                                  
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Calories"
                                        keyboardType="numeric"
                                        value={newFoodItem.calories.toString()}
                                        onChangeText={(text) =>
                                            setNewFoodItem({ ...newFoodItem, calories: parseInt(text) || 0 })
                                        }
                                    />
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Protein (g)"
                                        keyboardType="numeric"
                                        value={newFoodItem.protein.toString()}
                                        onChangeText={(text) =>
                                            setNewFoodItem({ ...newFoodItem, protein: parseInt(text) || 0 })
                                        }
                                    />
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Carbs (g)"
                                        keyboardType="numeric"
                                        value={newFoodItem.carbs.toString()}
                                        onChangeText={(text) =>
                                            setNewFoodItem({ ...newFoodItem, carbs: parseInt(text) || 0 })
                                        }
                                    />
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Fats (g)"
                                        keyboardType="numeric"
                                        value={newFoodItem.fats.toString()}
                                        onChangeText={(text) =>
                                            setNewFoodItem({ ...newFoodItem, fats: parseInt(text) || 0 })
                                        }
                                    />

                                    <View style={styles.modalButtonContainer}>
                                        <Button
                                            title="Hủy"
                                            onPress={() => {
                                                setAddModalVisible(false);
                                                setNewFoodItem({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
                                            }}
                                            color="#FF6347"
                                        />
                                        <Button title="Thêm món ăn" onPress={handleAddFood} color="#4CAF50" />
                                    </View>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

             <Modal
                 animationType="slide"
                 transparent={true}
                 visible={isEditModalVisible}
                 onRequestClose={() => {
                     setEditModalVisible(false);
                     setEditingFoodItem(null);
                     setNewFoodItem({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
                 }}
             >
                 <TouchableWithoutFeedback
                     onPress={() => {
                         setEditModalVisible(false);
                         setEditingFoodItem(null);
                         setNewFoodItem({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
                     }}
                 >
                     <View style={styles.modalOverlay}>
                         <TouchableWithoutFeedback onPress={() => {}}>
                             <View style={styles.modalContent}>
                                 <ScrollView showsVerticalScrollIndicator={false}>
                                     <Text style={styles.modalTitle}>Chỉnh sửa món ăn</Text>

                                     <View style={styles.imageContainer}>
                                         {newFoodItem.imageUri ? (
                                             <Image 
                                                 source={{ uri: newFoodItem.imageUri }} 
                                                 style={styles.foodImage} 
                                             />
                                         ) : (
                                             <View style={styles.placeholderImage}>
                                                 <Ionicons name="image-outline" size={40} color="#666" />
                                             </View>
                                         )}
                                         <TouchableOpacity 
                                             style={styles.selectImageButton}
                                             onPress={handleSelectImage}
                                         >
                                             <Text style={styles.selectImageText}>
                                                 {newFoodItem.imageUri ? 'Đổi ảnh' : 'Chọn ảnh'}
                                             </Text>
                                         </TouchableOpacity>
                                     </View>

                                     <TextInput
                                         style={styles.modalInput}
                                         placeholder="Tên món ăn"
                                         value={newFoodItem.name}
                                         onChangeText={(text) => setNewFoodItem({ ...newFoodItem, name: text })}
                                     />
                                     <TextInput
                                         style={styles.modalInput}
                                         placeholder="Calories"
                                         keyboardType="numeric"
                                         value={newFoodItem.calories.toString()}
                                         onChangeText={(text) =>
                                             setNewFoodItem({ ...newFoodItem, calories: parseInt(text) || 0 })
                                         }
                                     />
                                     <TextInput
                                         style={styles.modalInput}
                                         placeholder="Protein (g)"
                                         keyboardType="numeric"
                                         value={newFoodItem.protein.toString()}
                                         onChangeText={(text) =>
                                             setNewFoodItem({ ...newFoodItem, protein: parseInt(text) || 0 })
                                         }
                                     />
                                     <TextInput
                                         style={styles.modalInput}
                                         placeholder="Carbs (g)"
                                         keyboardType="numeric"
                                         value={newFoodItem.carbs.toString()}
                                         onChangeText={(text) =>
                                             setNewFoodItem({ ...newFoodItem, carbs: parseInt(text) || 0 })
                                         }
                                     />
                                     <TextInput
                                         style={styles.modalInput}
                                         placeholder="Fats (g)"
                                         keyboardType="numeric"
                                         value={newFoodItem.fats.toString()}
                                         onChangeText={(text) =>
                                             setNewFoodItem({ ...newFoodItem, fats: parseInt(text) || 0 })
                                         }
                                     />

                                     <View style={styles.modalButtonContainer}>
                                         <Button
                                             title="Hủy"
                                             onPress={() => {
                                                 setEditModalVisible(false);
                                                 setEditingFoodItem(null);
                                                 setNewFoodItem({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
                                             }}
                                             color="#FF6347"
                                         />
                                         <Button title="Lưu thay đổi" onPress={handleSaveEdit} color="#4CAF50" />
                                     </View>
                                 </ScrollView>
                             </View>
                         </TouchableWithoutFeedback>
                     </View>
                 </TouchableWithoutFeedback>
             </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
    itemContainer: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
    },
    foodItemContent: {
        flex: 1,
        marginRight: 10,
    },
    name: { fontWeight: 'bold', fontSize: 16 },
    favoriteButton: {
        padding: 8,
    },
    actionButtonContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    actionButton: {
        padding: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    foodImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    placeholderImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    selectImageButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    selectImageText: {
        color: '#fff',
        fontSize: 16,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    noDataText: {
        fontSize: 18,
        color: '#666',
    },
});

export default FoodScreen;
