import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import SignupScreen from '../screens/Signup';
import HomeStack from '../Stack/HomeStack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
      {/* <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="MenuStack" component={MenuStack} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
  );
}
