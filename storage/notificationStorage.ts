import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "APP_NOTIFICATIONS";

export async function saveNotification(notification) {
  const existing = await getNotifications();
  const updated = [notification, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function getNotifications() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function deleteNotification(id) {
  const existing = await getNotifications();
  const updated = existing.filter((n) => n.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function clearNotifications() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
