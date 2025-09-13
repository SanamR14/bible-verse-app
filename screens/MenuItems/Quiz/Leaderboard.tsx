import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Player } from "../../../types";
import { socket } from "../../../services/socket";

export default function Leaderboard({ route }: any) {
  const { sessionCode } = route.params;
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Request leaderboard from the server
    socket.emit("get_leaderboard", { sessionCode });

    // Listen for leaderboard updates and update state
    const handleLeaderboard = (data: Player[]) => {
      console.log("Leaderboard received:", data);
      setPlayers(data);
    };

    socket.on("leaderboard", handleLeaderboard);

    return () => {
      socket.off("leaderboard", handleLeaderboard);
    };
  }, [sessionCode]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Leaderboard</Text>
      {players.length === 0 ? (
        <Text>No players yet</Text>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Text style={{ fontSize: 18 }}>
              {index + 1}. {item.name} - {item.score}
            </Text>
          )}
        />
      )}
    </View>
  );
}
