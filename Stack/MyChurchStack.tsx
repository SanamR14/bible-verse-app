import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MyChurch from "../screens/MenuItems/MyChurch/MyChurch";
import SundaySchool from "../screens/MenuItems/MyChurch/SundaySchool";
import YoungAdults from "../screens/MenuItems/MyChurch/YoungAdults";
import Youth from "../screens/MenuItems/MyChurch/Youth";
import Sermon from "../screens/MenuItems/MyChurch/Sermon";
import Worship from "../screens/MenuItems/MyChurch/Worship";
import ChurchAdminStack from "./ChurchAdminStack";
import Calendar from "../screens/MenuItems/Calendar";
import FolderDetail from "../screens/MenuItems/MyChurch/FolderDetail";
import FilePreview from "../screens/MenuItems/MyChurch/FilePreview";

const Stack = createNativeStackNavigator();

const MyChurchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyChurch" component={MyChurch} />
      <Stack.Screen name="ChurchAdminStack" component={ChurchAdminStack} />
      <Stack.Screen name="Worship" component={Worship} />
      <Stack.Screen name="Sermon" component={Sermon} />
      <Stack.Screen name="SundaySchool" component={SundaySchool} />
      <Stack.Screen name="YoungAdults" component={YoungAdults} />
      <Stack.Screen name="Youth" component={Youth} />
      <Stack.Screen name="Calendar" component={Calendar} />
      <Stack.Screen name="FolderDetail" component={FolderDetail} />
      <Stack.Screen name="FilePreview" component={FilePreview} />
    </Stack.Navigator>
  );
};

export default MyChurchStack;
