// screens/quiz/Quiz.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { socket } from "../../../services/socket";
import { Player, Question } from "../../../types";
import { apiClient } from "../../../apiClient";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

export default function Quiz({ route, navigation }: any) {
  const { player, sessionCode, quizId, isPublic } = route.params;

  // For live quizzes
  const [question, setQuestion] = useState<Question | null>(null);
  const [answered, setAnswered] = useState(false);

  // For public quizzes
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isPublic) {
      // Load questions for public quiz
      axios
        .get<Question[]>(`${API_URL}/quiz/${quizId}/questions`)
        .then((res) => setQuestions(res.data))
        .catch((err) => {
          console.error(err);
          Alert.alert("Error", "Failed to load quiz");
        });
      return;
    }

    // Socket-based live quiz
    socket.on("question_started", (q: Question) => {
      setQuestion(q);
      setAnswered(false);
    });

    socket.on("question_result", ({ playerId }) => {
      if (playerId === player?.id) setAnswered(true);
    });

    socket.on("quiz_ended", () => {
      navigation.navigate("Leaderboard", { sessionCode });
    });

    return () => {
      socket.off("question_started");
      socket.off("question_result");
      socket.off("quiz_ended");
    };
  }, []);

  // ---- Submit answer for live quiz ----
  const submitAnswerLive = (optionIndex: number) => {
    if (answered || !question) return;
    socket.emit("submit_answer", {
      sessionCode,
      playerId: player.id,
      questionId: question.id,
      selectedOption: optionIndex,
    });
    setAnswered(true);
  };

  // ---- Submit answer for public quiz ----
  const submitAnswerPublic = async (optionIndex: number) => {
    const currentQ = questions[currentIndex];

    // calculate new score locally
    let newScore = score;
    console.log(currentQ.correct_answer, optionIndex);
    if (optionIndex === currentQ.correct_answer) {
      newScore += 1;
    }

    // move to next question or finish
    if (currentIndex + 1 < questions.length) {
      setScore(newScore);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setScore(newScore); // make sure state is updated
      await apiClient(`/quiz/${quizId}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: newScore }), // backend will get email from auth
      });
      navigation.navigate("Leaderboard", { quizId, isPublic: true });
    }
  };

  // ---- Render ----
  if (isPublic) {
    if (!questions.length) {
      return (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>Loading quiz…</Text>
        </View>
      );
    }
    const currentQ = questions[currentIndex];
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          {currentQ.question_text} ({currentIndex + 1}/{questions.length})
        </Text>
        {currentQ.options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.optionButton}
            onPress={() => submitAnswerPublic(idx)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // Live quiz UI:
  if (!question)
    return (
      <View style={styles.waitingContainer}>
        <Text style={styles.waitingText}>Waiting for host to start…</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{question.question_text}</Text>
      {question.options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.optionButton, answered && { backgroundColor: "#ccc" }]}
          onPress={() => submitAnswerLive(idx)}
          disabled={answered}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      {answered && <Text style={styles.answeredText}>Answer submitted!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#1b4a7a",
    padding: 14,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  optionText: { color: "#fff", fontSize: 16 },
  answeredText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "green",
  },
  waitingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  waitingText: { fontSize: 18, fontStyle: "italic" },
});
