// screens/quiz/HostSession.tsx
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
import { socket } from "../../../services/socket";
import { Question, Player } from "../../../types";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

export default function HostSession({ route, navigation }: any) {
  const { quizId } = route.params;
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  useEffect(() => {
    const createSession = async () => {
      try {
        const res = await axios.post<{ sessionCode: string }>(
          `${API_URL}/quiz/${quizId}/session`
        );
        setSessionCode(res.data.sessionCode);
        socket.emit("join_session", {
          playerName: "HOST",
          sessionCode: res.data.sessionCode,
        });
      } catch (err: any) {
        console.error("Error creating session", err.response?.data || err);
        Alert.alert(
          "Error",
          err.response?.data?.message || "Failed to start session"
        );
      }
    };

    const loadQuestions = async () => {
      try {
        const res = await axios.get<Question[]>(
          `${API_URL}/quiz/${quizId}/questions`
        );
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    createSession();
    loadQuestions();

    socket.on("player_joined", (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    });

    return () => {
      socket.off("player_joined");
    };
  }, []);

  useEffect(() => {
    if (!sessionCode) return;

    socket.on("all_answered", () => {
      setTimeout(() => {
        if (currentQIndex + 1 < questions.length) {
          setCurrentQIndex((prev) => {
            const nextIndex = prev + 1;
            const nextQ = questions[nextIndex];
            socket.emit("start_question", { sessionCode, question: nextQ });
            return nextIndex;
          });
        } else {
          socket.emit("end_quiz", { sessionCode });
          navigation.navigate("Leaderboard", { sessionCode });
        }
      }, 2000);
    });

    return () => {
      socket.off("all_answered");
    };
  }, [sessionCode, currentQIndex, questions]);

  const startQuestion = (index = currentQIndex) => {
    if (!sessionCode || !questions[index]) return;
    const question = questions[index];
    socket.emit("start_question", { sessionCode, question });
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => {
        const nextIndex = prev + 1;
        startQuestion(nextIndex);
        return nextIndex;
      });
    } else {
      socket.emit("end_quiz", { sessionCode });
      navigation.navigate("Leaderboard", { sessionCode });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Host Session</Text>
      {sessionCode && (
        <Text style={styles.code}>Session Code: {sessionCode}</Text>
      )}
      <Text style={styles.subHeader}>Players joined:</Text>

      <FlatList
        data={players}
        keyExtractor={(p) => p.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <Text style={styles.playerName}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center" }}>No players yet</Text>
        }
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1b4a7a" }]}
        onPress={() => startQuestion()}
        disabled={!sessionCode || questions.length === 0}
      >
        <Text style={styles.buttonText}>Start Question</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={nextQuestion}>
        <Text style={styles.buttonText}>Next Question</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  code: { fontSize: 18, textAlign: "center", marginBottom: 10 },
  subHeader: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  playerCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  playerName: { fontSize: 16 },
  button: {
    marginTop: 12,
    padding: 14,
    backgroundColor: "#4caf50",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
