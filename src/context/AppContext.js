import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentRisk, setCurrentRisk] = useState('ORANGE');
  const [currentWard, setCurrentWard] = useState('K/E');
  const [currentPMRS, setCurrentPMRS] = useState(35);
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Orange Alert — Andheri', body: 'Your region has moved to Orange Alert. PMRS: 35', time: '10 min ago', read: false },
    { id: 2, title: 'Drain Blocked — Reported', body: 'Your report CMP-042 has been assigned to Eng. Sharma', time: '1 hr ago', read: false },
    { id: 3, title: 'Safe Spot Update', body: 'Andheri Sports Complex is now open (3000 capacity)', time: '2 hr ago', read: true },
  ]);

  // Digital Triage Card
  const [triageData, setTriageData] = useState({
    bloodType: '',
    diabetes: false,
    allergies: '',
    medicines: '',
    disability: '',
    emergencyContact: '',
    emergencyContactPhone: '',
  });

  // Offline SOS queue — stores SOS requests when no internet
  const [offlineSOSQueue, setOfflineSOSQueue] = useState([]);
  const [meshStatus, setMeshStatus] = useState('idle'); // idle | scanning | relaying | synced

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const saveTriage = async (data) => {
    setTriageData(data);
    await AsyncStorage.setItem('triageData', JSON.stringify(data));
  };

  const queueOfflineSOS = async (sosPayload) => {
    const updated = [...offlineSOSQueue, { ...sosPayload, queuedAt: new Date().toISOString(), synced: false }];
    setOfflineSOSQueue(updated);
    await AsyncStorage.setItem('offlineSOSQueue', JSON.stringify(updated));
  };

  const syncOfflineQueue = async () => {
    if (!isOnline || offlineSOSQueue.length === 0) return;
    // Mark all as synced (in real app, POST to server here)
    const synced = offlineSOSQueue.map(s => ({ ...s, synced: true }));
    setOfflineSOSQueue(synced);
    await AsyncStorage.setItem('offlineSOSQueue', JSON.stringify(synced));
  };

  // Load persisted data on mount
  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('triageData');
      if (t) setTriageData(JSON.parse(t));
      const q = await AsyncStorage.getItem('offlineSOSQueue');
      if (q) setOfflineSOSQueue(JSON.parse(q));
    })();
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) syncOfflineQueue();
  }, [isOnline]);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      currentRisk, setCurrentRisk,
      currentWard, setCurrentWard,
      currentPMRS, setCurrentPMRS,
      language, setLanguage,
      isOnline, setIsOnline,
      notifications, markNotificationRead, unreadCount,
      triageData, saveTriage,
      offlineSOSQueue, queueOfflineSOS, syncOfflineQueue,
      meshStatus, setMeshStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
