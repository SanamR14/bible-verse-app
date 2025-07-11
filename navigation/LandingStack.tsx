import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import SignupScreen from '../screens/Signup';
import LandingPage from './LandingPage';
import Menu from '../screens/Menu';
import MainTabs from './MainTabs';



const Stack = createNativeStackNavigator();

export default function LandingPageStack() {
  return (
    <Stack.Navigator>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
