// src/navigation/RootNavigator.tsx
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import HomeStack from "../Stack/HomeStack";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isSignedIn, setIsSignedIn] = useState<Boolean | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsSignedIn(!!token);
    };
    checkAuth();
  }, []);

  if (isSignedIn === null) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name="HomeStack" component={HomeStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
