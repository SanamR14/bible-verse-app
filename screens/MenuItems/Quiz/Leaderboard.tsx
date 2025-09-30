// screens/quiz/Leaderboard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { socket } from "../../../services/socket";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

interface Player {
  id?: number; // for live quiz
  name?: string; // for live quiz
  user_email?: string; // for public quiz
  score: number;
}

export default function Leaderboard({ route, navigation }: any) {
  const { quizId, sessionCode, isPublic } = route.params;
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (isPublic) {
      // Public quiz: fetch leaderboard from API
      fetch(`${API_URL}/quiz/${quizId}/leaderboard`)
        .then((res) => res.json())
        .then((data) => setPlayers(data))
        .catch((err) => console.error("Failed to fetch leaderboard:", err));
    } else {
      // Live quiz: listen via socket
      socket.emit("get_leaderboard", { sessionCode });
      const handleLeaderboard = (data: Player[]) => setPlayers(data);
      socket.on("leaderboard", handleLeaderboard);
      return () => socket.off("leaderboard", handleLeaderboard);
    }
  }, [quizId, sessionCode, isPublic]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>

      {players.length === 0 ? (
        <Text style={styles.empty}>No players yet</Text>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.rank}>{index + 1}.</Text>
              <Text style={styles.name}>
                {isPublic ? item.user_email : item.name}
              </Text>
              <Text style={styles.score}>{item.score}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1b4a7a",
  },
  empty: { textAlign: "center", fontSize: 16, marginTop: 20 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 14,
    marginVertical: 6,
    borderRadius: 8,
  },
  rank: { fontSize: 18, fontWeight: "bold", width: 30 },
  name: { fontSize: 18, flex: 1 },
  score: { fontSize: 18, fontWeight: "600" },
  button: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#1b4a7a",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
