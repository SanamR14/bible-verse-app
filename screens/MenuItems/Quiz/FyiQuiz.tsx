// screens/quiz/FyiQuiz.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider } from "react-native-safe-area-context";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

export default function FyiQuiz({ navigation }: any) {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/quiz/public`);
        setQuizzes(res.data);
      } catch (err) {
        console.error("Error fetching FYI quizzes", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const renderQuizItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() =>
          navigation.navigate("Quiz", {
            quizId: item.id,
            isPublic: true, // so Quiz screen knows it’s a public quiz
          })
        }
      >
        <Text style={styles.playButtonText}>Play</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      {/* Header */}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1b4a7a"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={quizzes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderQuizItem}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No FYI quizzes available.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b4a7a",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  playButton: {
    marginTop: 12,
    backgroundColor: "#1b4a7a",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  playButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
