// storage/notificationStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "APP_NOTIFICATIONS";

export async function saveNotification(notification) {
  const existing = await getNotifications();
  await AsyncStorage.setItem(KEY, JSON.stringify([notification, ...existing]));
}

export async function getNotifications() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearNotifications() {
  await AsyncStorage.removeItem(KEY);
}

export async function deleteNotification(id) { 
  const existing = await getNotifications(); 
  const updated = existing.filter((n) => n.id !== id); 
  await AsyncStorage.setItem(KEY, JSON.stringify(updated)); 
}