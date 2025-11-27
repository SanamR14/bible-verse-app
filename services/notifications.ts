// services/notifications.ts
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Android requirement
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    sound: "default",
  });
}

// Register & return Expo push token
export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ||
    Constants?.easConfig?.projectId;

  const tokenResponse = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return tokenResponse.data;
}

// Local daily verse notification at 7am
export async function scheduleDailyBibleVerse() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📖 Today's Bible Verse",
      body: "Tap to read today’s word of God!",
      sound: "default",
    },
    trigger: { hour: 7, minute: 0, repeats: true },
  });
}
