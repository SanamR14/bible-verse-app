import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Members from "../screens/MenuItems/ChurchAdmin/Members";
import ChurchAdmin from "../screens/MenuItems/ChurchAdmin/ChurchAdmin";
import Rota from "../screens/MenuItems/ChurchAdmin/Rota";
import AddEventAndRota from "../screens/MenuItems/ChurchAdmin/AddEventAndRota";

const Stack = createNativeStackNavigator();

const ChurchAdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChurchAdmin" component={ChurchAdmin} />
      <Stack.Screen name="Members" component={Members} />
      {/* <Stack.Screen name="Rota" component={Rota} /> */}
      <Stack.Screen name="AddEventAndRota" component={AddEventAndRota} />
    </Stack.Navigator>
  );
};

export default ChurchAdminStack;
