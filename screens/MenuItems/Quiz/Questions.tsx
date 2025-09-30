// screens/quiz/AddQuestion.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

export default function AddQuestion({ route, navigation }: any) {
  const { quizId } = route.params;
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const addQuestion = async () => {
    if (!questionText || options.some((o) => !o) || correctAnswer === "") {
      return Alert.alert("Error", "Fill in all fields");
    }
    try {
      await axios.post(`${API_URL}/quiz/${quizId}/questions`, {
        question_text: questionText,
        options,
        correct_answer: parseInt(correctAnswer),
      });
      Alert.alert("Added", "Question added successfully");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add question");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Add Question</Text>
      <TextInput
        placeholder="Question text"
        value={questionText}
        onChangeText={setQuestionText}
        style={styles.input}
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
          style={styles.input}
        />
      ))}
      <TextInput
        placeholder="Correct option index (0-3)"
        keyboardType="numeric"
        value={correctAnswer}
        onChangeText={setCorrectAnswer}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={addQuestion}>
        <Text style={styles.buttonText}>Add Question</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4caf50", marginTop: 10 }]}
        onPress={() => navigation.navigate("SavedQuiz")}
      >
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "#1b4a7a", padding: 14, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600", textAlign: "center" },
});
