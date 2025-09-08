import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

export default function Questions({ route, navigation }: any) {
  const { quizId } = route.params;
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  const addQuestion = async () => {
    if (!questionText || options.some((o) => !o) || correctAnswer === null) {
      return Alert.alert("Error", "Fill in all fields");
    }
    try {
      await axios.post(`${API_URL}/quiz/${quizId}/questions`, {
        question_text: questionText,
        options,
        correct_answer: correctAnswer,
      });
      Alert.alert("Added", "Question added successfully");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(null);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add question");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Add Question</Text>
      <TextInput
        placeholder="Question text"
        value={questionText}
        onChangeText={setQuestionText}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {options.map((opt, idx) => (
        <TextInput
          key={idx}
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChangeText={(txt) => {
            const newOpts = [...options];
            newOpts[idx] = txt;
            setOptions(newOpts);
          }}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />
      ))}

      <TextInput
        placeholder="Correct option index (0-3)"
        keyboardType="numeric"
        value={correctAnswer !== null ? correctAnswer.toString() : ""}
        onChangeText={(txt) => setCorrectAnswer(parseInt(txt))}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Add Question" onPress={addQuestion} />
      <Button
        title="Done → Start Session"
        onPress={() => navigation.navigate("HostSession", { quizId })}
      />
    </View>
  );
}
