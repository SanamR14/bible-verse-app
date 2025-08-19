import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SavedPage from "../screens/MenuItems/Saved";
import SavedDetail from "../screens/MenuItems/SavedDetail";

const Stack = createNativeStackNavigator();

const SavedStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Saved" component={SavedPage} />
      <Stack.Screen name="SavedDetail" component={SavedDetail} />
    </Stack.Navigator>
  );
};

export default SavedStack;
