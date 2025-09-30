import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CreateQuiz from "../screens/MenuItems/Quiz/CreateQuiz";
import HostSession from "../screens/MenuItems/Quiz/HostSession";
import Leaderboard from "../screens/MenuItems/Quiz/Leaderboard";
import Questions from "../screens/MenuItems/Quiz/Questions";
import SavedQuiz from "../screens/MenuItems/Quiz/SavedQuiz";
import QuizDetail from "../screens/MenuItems/Quiz/QuizDetail";

const Stack = createNativeStackNavigator();

const AdminQuizStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateQuiz" component={CreateQuiz} />
      <Stack.Screen name="AddQuestion" component={Questions} />
      <Stack.Screen name="SavedQuiz" component={SavedQuiz} />
      <Stack.Screen name="QuizDetail" component={QuizDetail} />
      <Stack.Screen name="HostSession" component={HostSession} />
      <Stack.Screen name="Leaderboard" component={Leaderboard} />
    </Stack.Navigator>
  );
};

export default AdminQuizStack;
