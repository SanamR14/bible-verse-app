import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HolyBible from "../screens/MenuItems/HolyBible/HolyBible";
import BibleChapters from "../screens/MenuItems/HolyBible/BibleChapters";
import BibleReader from "../screens/MenuItems/HolyBible/BibleReader";

const Stack = createNativeStackNavigator();

export default function BibleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HolyBible" component={HolyBible} />
      <Stack.Screen name="BibleChapters" component={BibleChapters} />
      <Stack.Screen name="BibleReader" component={BibleReader} />
    </Stack.Navigator>
  );
}
