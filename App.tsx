import React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import RootNavigator from "./navigation/RootNavigator";
import Toast from "react-native-toast-message";

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <RootNavigator />
      <Toast />
    </NavigationContainer>
  );
}
