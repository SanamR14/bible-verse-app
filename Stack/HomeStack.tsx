import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MainTabs from '../navigation/MainTabs';
import MenuStack from './MenuStack';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
     <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="MainTabs" component={MainTabs}/>
         <Stack.Screen name="MenuStack" component={MenuStack} />
       </Stack.Navigator>
  )
}

export default HomeStack