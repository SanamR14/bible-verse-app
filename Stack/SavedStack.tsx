import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SavedPage from "../screens/MenuItems/Saved";
import Day from "../screens/Devotions/Day";

const Stack = createNativeStackNavigator();

const SavedStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Saved" component={SavedPage} />
      <Stack.Screen name="Day" component={Day} />
    </Stack.Navigator>
  );
};

export default SavedStack;
