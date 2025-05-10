import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { DailyLog } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface AppContextProps {
    dailyLogs: DailyLog[];
  setDailyLogs: React.Dispatch<React.SetStateAction<DailyLog[]>>;
}


export const AppContext = createContext<AppContextProps>({
  dailyLogs: [],
  setDailyLogs: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

const App: React.FC<AppProviderProps> = ({ children }) => {
    const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const logs = await AsyncStorage.getItem('dailyLogs');
        if (logs) {
          setDailyLogs(JSON.parse(logs));
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load data");
      }
    };
    loadData();
  }, []);

    return (
    <AppContext.Provider value={{ dailyLogs, setDailyLogs }}>
        {children}
    </AppContext.Provider>
  );
};


export default App;

