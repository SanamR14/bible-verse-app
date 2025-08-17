import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Devotions, { Devotion } from "../screens/Devotions/Devotions";
import Topic from "../screens/Devotions/Topic";
import Day from "../screens/Devotions/Day";

export type DevotionStackParamList = {
  Devotion: undefined;
  Topic: { topic: Devotion };
  Day: { topic: Devotion; day: number; isSaved: boolean };
};

const Stack = createNativeStackNavigator<DevotionStackParamList>();

export default function DevotionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Devotion" component={Devotions} />
      <Stack.Screen name="Topic" component={Topic} />
      <Stack.Screen name="Day" component={Day} />
    </Stack.Navigator>
  );
}
