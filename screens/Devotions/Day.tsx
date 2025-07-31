// src/screens/DayScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { DevotionStackParamList } from "../../Stack/DevotionsStack";
import Icon from "react-native-vector-icons/Feather";

export default function DayScreen() {
  const route = useRoute<RouteProp<DevotionStackParamList, "Day">>();
  const { topic, day } = route.params;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{topic}</Text>
        <Text></Text>
      </View>
      <View style={styles.contentCard}>
        <Text style={styles.dayTitle}>Day - {day}</Text>
        {/* You can replace this with actual devotion content */}
        <Text style={styles.content}>
          This is devotion content for Day {day} of {topic}.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  contentCard: {
    backgroundColor: "#fcf8f2",
    padding: 16,
    borderRadius: 12,
  },
  dayTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  content: { fontSize: 14 },
});
