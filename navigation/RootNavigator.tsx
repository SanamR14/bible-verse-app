// import React, { useEffect, useState } from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import AuthStack from "./AuthStack";
// import MainTabs from "./MainTabs";
// import HomeStack from "../Stack/HomeStack";

// const Stack = createNativeStackNavigator();

// export default function RootNavigator() {
//   const [isSignedIn, setIsSignedIn] = useState<Boolean | null>(null);
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await AsyncStorage.getItem("userToken");
//       const user = await AsyncStorage.getItem("userData");
//       console.log(user);
//       setIsSignedIn(!!token);
//     };
//     checkAuth();
//   }, []);

//   if (isSignedIn === null) return null;

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {isSignedIn ? (
//         <Stack.Screen name="HomeStack" component={HomeStack} />
//       ) : (
//         <Stack.Screen name="Auth" component={AuthStack} />
//       )}
//     </Stack.Navigator>
//   );
// }

import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthStack from "./AuthStack";
import HomeStack from "../Stack/HomeStack";
import AdminStack from "../Stack/AdminStack";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isSignedIn, setIsSignedIn] = useState<Boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<Boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const userJson = await AsyncStorage.getItem("userData");

      if (userJson) {
        const user = JSON.parse(userJson);
        if (user.email.endsWith("@admin.fyi.com")) {
          setIsAdmin(true);
        }
      }

      setIsSignedIn(!!token);
    };
    checkAuth();
  }, []);

  if (isSignedIn === null) return null; // splash screen / loader
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <>
          {/* <Stack.Screen name="HomeStack" component={HomeStack} />
          {isAdmin && (
            <Stack.Screen name="AdminStack" component={AdminStack} />
          )} */}
          {isAdmin ? (
            <Stack.Screen name="AdminStack" component={AdminStack} />
          ) : (
            <Stack.Screen name="HomeStack" component={HomeStack} />
          )}
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
