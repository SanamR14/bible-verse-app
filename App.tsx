import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RootNavigator from "./navigation/RootNavigator";
import {
  registerForPushNotifications,
  scheduleDailyBibleVerse,
} from "./services/notifications";
import { savePushToken } from "./services/notificationsAPI";
import { saveNotification } from "./storage/notificationStorage";
import { Platform } from "react-native";

// Handle notification received
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

export default function App() {
  useEffect(() => {
    const init = async () => {
      const rawUser = await AsyncStorage.getItem("userData");
      if (!rawUser) return;
      const user = JSON.parse(rawUser);

      // Register push token
      const token = await registerForPushNotifications();

      if (token) {
        await savePushToken(user.id, token);
      }
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      // Schedule daily Bible verse
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
