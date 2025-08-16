// Day.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { DevotionStackParamList } from "../../Stack/DevotionsStack";
import Icon from "react-native-vector-icons/Feather";

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{topic.title}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Icon
            name="bookmark"
            size={24}
            color={isSaved ? "black" : "silver"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentCard}>
          <Text style={styles.content}>{content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentCard: {
    backgroundColor: "#fcf8f2",
    padding: 16,
    borderRadius: 12,
  },
  content: { fontSize: 16, color: "#333", lineHeight: 22 },
});
