import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Members from "../screens/ChurchAdmin/Members";
import ChurchAdmin from "../screens/ChurchAdmin/ChurchAdmin";

const Stack = createNativeStackNavigator();

const ChurchAdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChurchAdmin" component={ChurchAdmin} />
      <Stack.Screen name="Members" component={Members} />
    </Stack.Navigator>
  );
};

export default ChurchAdminStack;
