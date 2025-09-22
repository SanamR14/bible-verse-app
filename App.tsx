import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";
import Toast from "react-native-toast-message";
import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { ThemeProvider, ThemeContext } from "./themeContext";
import { darkTheme } from "./theme";

function HomeScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        Hello in {theme === darkTheme ? "Dark" : "Light"} Mode!
      </Text>
      <Button
        title="Toggle Theme"
        onPress={toggleTheme}
        color={theme.primary}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
      <Toast />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});
