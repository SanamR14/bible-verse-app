import React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function FyiQuiz() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1b4a7a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FYI Quiz</Text>
        <View style={{ width: 24 }} /> {/* spacing to balance icon */}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.infoText}>
          Welcome to the FYI Quiz — a pre-built quiz created by the FYI Team.
        </Text>
        {/* You can add your quiz list or start button here */}
      </View>
    </SafeAreaView>
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
    borderBottomColor: "#eee",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b4a7a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
});
