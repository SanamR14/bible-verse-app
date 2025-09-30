// screens/quiz/QuizDetail.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

export default function QuizDetail({ route, navigation }: any) {
  const { quizId } = route.params;
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQuiz = async () => {
    try {
      // assume backend returns {title:"Quiz title",questions:[...]}
      const res = await axios.get(`${API_URL}/quiz/${quizId}/questions`);
      setQuestions(res.data || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = (questionId: number) => {
    Alert.alert("Delete Question", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/quiz/questions/${questionId}`);
            Alert.alert("Deleted", "Question deleted successfully");
            loadQuiz();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete question");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  if (loading)
    return <Text style={{ textAlign: "center", marginTop: 20 }}>Loading…</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.question}>{item.question_text}</Text>

            {/* Display options nicely */}
            {item.options && Array.isArray(item.options) ? (
              item.options.map((opt: string, idx: number) => (
                <Text key={idx} style={styles.option}>
                  {idx + 1}. {opt}
                </Text>
              ))
            ) : (
              <Text style={styles.option}>{item.options}</Text>
            )}

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteQuestion(item.id)}
            >
              <Text style={styles.deleteBtnText}>Delete Question</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center" }}>No questions yet</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddQuestion", { quizId })}
      >
        <Text style={styles.addButtonText}>+ Add Questions</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  question: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  option: { marginLeft: 8, color: "#555" },
  deleteBtn: {
    marginTop: 8,
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteBtnText: { color: "#fff", fontWeight: "600" },
  addButton: {
    marginTop: 20,
    backgroundColor: "#1b4a7a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
