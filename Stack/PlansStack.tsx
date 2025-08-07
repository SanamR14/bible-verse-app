import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Plans, { Plan } from '../screens/Plans/Plans';
import Planstopic from '../screens/Plans/Planstopic';
import Plansday from '../screens/Plans/Plansday';


export type PlansStackParamList = {
  Plans: undefined;
  Plans_Topic: { topic: Plan };
  Plans_Day: { topic: Plan; day: number };
};

const Stack = createNativeStackNavigator<PlansStackParamList>();

export default function PlansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Plans" component={Plans}/>
      <Stack.Screen name="Plans_Topic" component={Planstopic} />
      <Stack.Screen name="Plans_Day" component={Plansday} />
    </Stack.Navigator>
  );
}
