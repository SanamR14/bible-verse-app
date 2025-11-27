import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

// MUST for Android to receive notifications in background
Notifications.setNotificationChannelAsync("default", {
  name: "default",
  importance: Notifications.AndroidImportance.MAX,
  sound: "default",
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log("Physical device required for push notifications.");
    return null;
  }

  // Request permissions
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permission not granted");
    return null;
  }

  // Get correct projectId for EAS
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ||
    Constants?.easConfig?.projectId;

  const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
  const token = tokenResponse.data;

  return token;
}

// Daily Bible verse at 7 AM
export async function scheduleDailyBibleVerse() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📖 Today's Bible Verse",
      body: "Tap to read today's word of God!",
      sound: "default",
    },
    trigger: { hour: 7, minute: 0, repeats: true },
  });
}

export async function sendPushNotification(token: string, message: string) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      sound: "default",
      title: "New Notification",
      body: message,
    }),
  });
}

