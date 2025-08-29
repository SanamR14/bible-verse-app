import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { ScrollView } from "react-native";
import { PlansStackParamList } from "../../Stack/PlansStack";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DayScreen() {
  const route = useRoute<RouteProp<PlansStackParamList, "Plans_Day">>();
  const { topic, day } = route.params;
  const navigation = useNavigation();
  const [isSaved, setIsSaved] = useState(Boolean);

  const findSaved = async () => {
    const user = await AsyncStorage.getItem("userData");
    if (!user) {
      alert("Please log in first.");
      return;
    }
    const userData = JSON.parse(user);

    if (topic.item_id) {
      topic.id = topic.item_id;
    }
    const res = await fetch(
      `https://bible-verse-backend-1kvo.onrender.com/saved/plan/${userData.id}/${topic.id}`
    );
    const data = await res.json();
    if (data.length === 0) {
      setIsSaved(false);
    } else {
      setIsSaved(true);
    }
  };
  useEffect(() => {
    findSaved();
  }, []);

  const handleSave = async () => {
    const user = await AsyncStorage.getItem("userData");
    if (!user) {
      alert("Please log in first.");
      return;
    }
    const userData = JSON.parse(user);
    const payload = {
      userid: userData.id,
      item_type: "plan",
      item_id: topic.id,
      title: topic.title,
      message: topic.message,
      author: topic.author,
    };
    if (!isSaved) {
      // --- SAVE devotion ---
      setIsSaved(true); // update UI instantly
      try {
        const res = await fetch(
          "https://bible-verse-backend-1kvo.onrender.com/saved",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (res.ok) {
          Toast.show({ type: "success", text1: "Your Plan is saved!" });
        } else {
          setIsSaved(false); // rollback if failed
          Toast.show({ type: "error", text1: "Failed to save your Plan." });
        }
      } catch (err) {
        setIsSaved(false); // rollback
        console.error("Save error:", err);
        alert("Error saving plan");
      }
    } else {
      // --- REMOVE devotion ---
      setIsSaved(false); // update UI instantly
      try {
        const response = await fetch(
          `https://bible-verse-backend-1kvo.onrender.com/saved/${payload.item_type}/${userData.id}/${topic.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          Toast.show({
            type: "success",
            text1: "Plan removed from saved!",
          });
        } else {
          setIsSaved(true); // rollback
          Toast.show({
            type: "error",
            text1: "Failed to remove saved plan.",
          });
        }
      } catch (error) {
        setIsSaved(true); // rollback
        console.error("Delete error:", error);
      }
    }
  };

  const content =
    topic.days && topic.days[day] ? topic.days[day].message : topic.message;

  const dayTitle =
    topic.days && topic.days[day]?.title ? topic.days[day].title : topic.title;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#1b4b7aff" />
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {topic.title}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Icon
                name="bookmark"
                size={24}
                color={isSaved ? "#1b4b7aff" : "#90a9afff"}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scroll}>
            <View style={styles.contentCard}>
              {/* <Text style={styles.dayTitle}>{dayTitle}</Text> */}
              <Text style={styles.content}>{content}</Text>
            </View>
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 16 },
  scroll: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1b4b7aff",
  },
  contentCard: {
    backgroundColor: "#ECF0F1",
    padding: 16,
    borderRadius: 12,
    margin: 14,
  },
  dayTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  content: { fontSize: 14, color: "#1b4a7aff" },
});
