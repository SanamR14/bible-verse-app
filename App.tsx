// App.tsx
import React, { useEffect, useRef } from "react";
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

// When notification arrives (foreground & background)
Notifications.setNotificationHandler({
  handleNotification: async ({ request }) => {
    await saveNotification({
      id: Date.now().toString(),
      title: request.content.title,
      body: request.content.body,
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

      // Get device Expo push token
      const token = await registerForPushNotifications();

      if (token) {
        await savePushToken(user.id, token);
      }

      // 7am daily
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
