// screens/quiz/SavedQuizzes.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native";
import { apiClientGet } from "../../../apiClient";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

export default function SavedQuiz({ navigation }: any) {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQuizzes = async () => {
    try {
      const data = await apiClientGet(`/quiz/my`);
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadQuizzes);
    return unsubscribe;
  }, [navigation]);

  const deleteQuiz = async (quizId: number) => {
    Alert.alert("Delete Quiz", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Match your backend route exactly:
            await axios.delete(`${API_URL}/quiz/delete/${quizId}`);

            Alert.alert("Deleted", "Quiz deleted successfully"); // <== NEW

            loadQuizzes();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete quiz");
          }
        },
      },
    ]);
  };

  const startSession = (quizId: number) => {
    navigation.navigate("HostSession", { quizId });
  };

  const addQuestions = (quizId: number) => {
    navigation.navigate("AddQuestion", { quizId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Existing Quizzes</Text>
      {loading ? (
        <Text>Loading…</Text>
      ) : quizzes.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No quizzes yet
        </Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => addQuestions(item.id)}
                >
                  <Text style={styles.buttonText}>Add Questions</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#4caf50" }]}
                  onPress={() => startSession(item.id)}
                >
                  <Text style={styles.buttonText}>Start Session</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#2196f3" }]}
                  onPress={() =>
                    navigation.navigate("QuizDetail", { quizId: item.id })
                  }
                >
                  <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#f44336" }]}
                  onPress={() => deleteQuiz(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateQuiz")}
      >
        <Text style={styles.createButtonText}>+ Create New Quiz</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 10,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
    backgroundColor: "#1b4a7a",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },

  // 👇 New styles for bottom button
  createButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 12,
    backgroundColor: "#1b4a7a",
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
