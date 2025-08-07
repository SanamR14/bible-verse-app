// DayScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { DevotionStackParamList } from "../../Stack/DevotionsStack";
import Icon from "react-native-vector-icons/Feather";
import { ScrollView } from "react-native";

export default function DayScreen() {
  const route = useRoute<RouteProp<DevotionStackParamList, "Day">>();
  const { topic, day } = route.params;
  const navigation = useNavigation();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const content =
    topic.days && topic.days[day] ? topic.days[day].message : topic.message;

  const dayTitle =
    topic.days && topic.days[day]?.title ? topic.days[day].title : topic.title;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{topic.title}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Icon
            name={isSaved ? "bookmark" : "bookmark"}
            size={24}
            color={isSaved ? "black" : "silver"}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.contentCard}>
          {/* <Text style={styles.dayTitle}>{dayTitle}</Text> */}
          <Text style={styles.content}>{content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  scroll: { flex: 1 },
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
  content: { fontSize: 14, color: "#333" },
});
