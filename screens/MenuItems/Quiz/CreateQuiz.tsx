import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import { Quiz } from "../../../types";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

export default function CreateQuiz({ navigation }: any) {
  const [title, setTitle] = useState("");

  const createQuiz = async () => {
    try {
      const res = await axios.post<Quiz>(`${API_URL}/quiz`, { title });
      const quiz = res.data;
      Alert.alert("Quiz Created", `ID: ${quiz.id}`);
      navigation.navigate("AddQuestion", { quizId: quiz.id });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create quiz");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Create New Quiz</Text>
      <TextInput
        placeholder="Quiz Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Create Quiz" onPress={createQuiz} />
    </View>
  );
}
