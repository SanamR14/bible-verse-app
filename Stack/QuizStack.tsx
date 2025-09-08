import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import CreateQuiz from "../screens/MenuItems/Quiz/CreateQuiz";
import HostSession from "../screens/MenuItems/Quiz/HostSession";
import Leaderboard from "../screens/MenuItems/Quiz/Leaderboard";
import JoinQuiz from "../screens/MenuItems/Quiz/JoinQuiz";
import Quiz from "../screens/MenuItems/Quiz/Quiz";
import Questions from "../screens/MenuItems/Quiz/Questions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const QuizStack = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userJson = await AsyncStorage.getItem("userData");
      if (userJson) {
        const user = JSON.parse(userJson);
        setIsAdmin(user.email.endsWith("@admin.fyi.com"));
      } else {
        setIsAdmin(false);
      }
    };
    checkAuth();
  }, []);

  // Wait until we know if user is admin
  if (isAdmin === null) return null;

  return (
    <Stack.Navigator initialRouteName={isAdmin ? "CreateQuiz" : "JoinQuiz"}>
      {isAdmin ? (
        <>
          <Stack.Screen name="CreateQuiz" component={CreateQuiz} />
          <Stack.Screen name="AddQuestion" component={Questions} />
          <Stack.Screen name="HostSession" component={HostSession} />
          <Stack.Screen name="Leaderboard" component={Leaderboard} />
        </>
      ) : (
        <>
          <Stack.Screen name="JoinQuiz" component={JoinQuiz} />
          <Stack.Screen name="Quiz" component={Quiz} />
          <Stack.Screen name="Leaderboard" component={Leaderboard} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default QuizStack;
