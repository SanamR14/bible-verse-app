import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";
import About from "../screens/About";
import Explore from "../screens/Explore";
import Home from "../screens/Home/Home";
import DevotionsStack from "../Stack/DevotionsStack";
import { PaperProvider } from "react-native-paper";
import Header from "../screens/header";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlansStack from "../Stack/PlansStack";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function MainTabs() {
  return (
    <PaperProvider>
      <Header />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          headerTitleAlign: "center",
          tabBarIcon: ({ color, size }) => {
            let iconName = "home";

            switch (route.name) {
              case "Home":
                iconName = "home";
                break;
              case "Devotions":
                iconName = "book";
                break;
              case "Explore":
                iconName = "search";
                break;
              case "Plans":
                iconName = "calendar";
                break;
              case "About":
                iconName = "user";
                break;
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#1b4b7aff",
          tabBarInactiveTintColor: "#90a9afff",
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Devotions" component={DevotionsStack} />
        <Tab.Screen name="Explore" component={Explore} />
        <Tab.Screen name="Plans" component={PlansStack} />
        <Tab.Screen name="About" component={About} />
      </Tab.Navigator>
    </PaperProvider>
  );
}
