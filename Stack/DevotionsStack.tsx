
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Devotions from '../screens/Devotions/Devotions';
import Topic from '../screens/Devotions/Topic';
import Day from '../screens/Devotions/Day';

export type DevotionStackParamList = {
  Devotions: undefined;
  Topic: { topic: string };
  Day: { topic: string; day: number };
};

const Stack = createNativeStackNavigator<DevotionStackParamList>();

export default function DevotionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Devotions" component={Devotions} />
      <Stack.Screen name="Topic" component={Topic} />
      <Stack.Screen name="Day" component={Day} />
    </Stack.Navigator>
  );
}
