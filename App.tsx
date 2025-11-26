import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import RootNavigator from "./navigation/RootNavigator";
import { registerForPushNotifications } from "./services/notifications";
import { savePushToken } from "./services/notificationsAPI";
import { saveNotification } from "./storage/notificationStorage";

// ----------------------
// Handle notification globally
// ----------------------
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    saveNotification({
      id: Date.now().toString(),
      title: notification.request.content.title,
      body: notification.request.content.body,
      date: new Date().toISOString(),
    });

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

// ----------------------
// Schedule daily local notification
// ----------------------
async function scheduleDailyBibleVerse() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📖 Daily Bible Verse",
      body: "Start your day with today's Word of God!",
      sound: "default",
    },
    trigger: {
      hour: 7,
      minute: 0,
      repeats: true,
    },
  });
}

export default function App() {
  useEffect(() => {
    const init = async () => {
      const rawUser = await AsyncStorage.getItem("userData");
      if (!rawUser) return;

      const user = JSON.parse(rawUser);

      // Register for push notifications and save token in backend
      const token = await registerForPushNotifications();
      if (token) {
        await savePushToken(user.id, token);
      }

      // Schedule daily local notification for Bible verse
      await scheduleDailyBibleVerse();
    };

    init();
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
      <Toast />
    </NavigationContainer>
  );
}
