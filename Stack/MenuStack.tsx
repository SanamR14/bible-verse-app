
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForYou from '../screens/MenuItems/ForYou';
import ChristCommunity from '../screens/MenuItems/ChristCommunity';
import Help from '../screens/MenuItems/Help';
import Fellowship from '../screens/MenuItems/Fellowship';
import PrayerRequest from '../screens/MenuItems/PrayerRequest';
import Profile from '../screens/MenuItems/Profile';
import Saved from '../screens/MenuItems/Saved';
import Menu from '../screens/Menu';
import PrayerWarrior from '../screens/MenuItems/PrayerWarrior';

export type MenuStackParamList = {
  Menu: undefined;
  Profile: { topic: string };
  Saved: { topic: string };
  PrayerRequest: { topic: string};
  Fellowship: { topic: string};
  PrayerWarrior: { topic: string};
  ForYou: { topic: string};
  ChristCommunity: { topic: string};
  Help: { topic: string};
};

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Saved" component={Saved} />
      <Stack.Screen name="PrayerRequest" component={PrayerRequest} />
      <Stack.Screen name="Fellowship" component={Fellowship} />
      <Stack.Screen name="PrayerWarrior" component={PrayerWarrior} />
      <Stack.Screen name="ForYou" component={ForYou} />
      <Stack.Screen name="ChristCommunity" component={ChristCommunity} />
      <Stack.Screen name="Help" component={Help} />
      
    </Stack.Navigator>
  );
}
