import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MainTabs from "../navigation/MainTabs";
import MenuStack from "./MenuStack";
import Notifications from "../screens/MenuItems/Notifications";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="MenuStack" component={MenuStack} />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
};

export default HomeStack;
