import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Members from "../screens/ChurchAdmin/Members";

const Stack = createNativeStackNavigator();

const ChurchAdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Members" component={Members} />
    </Stack.Navigator>
  );
};

export default ChurchAdminStack;
