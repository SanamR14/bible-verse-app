import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { DevotionStackParamList } from "../../Stack/DevotionsStack";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { apiClient, apiClientGet } from "../../apiClient";

export default function DayScreen() {
  const route = useRoute<RouteProp<DevotionStackParamList, "Day">>();
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
    const res = await apiClientGet(
      `/saved/devotion/${userData.id}/${topic.id}`
    );
    const data = await res;
    if (data.length === 0) {
      setIsSaved(false);
    } else if (data.length === 1) {
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
      item_type: "devotion",
      item_id: topic.id,
      title: topic.title,
      message: topic.message,
      author: topic.author,
    };
    if (!isSaved) {
      // --- SAVE devotion ---
      setIsSaved(true); // update UI instantly
      try {
        const res = await apiClient("/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          Toast.show({ type: "success", text1: "Devotion saved!" });
        } else {
          setIsSaved(false); // rollback if failed
          Toast.show({ type: "error", text1: "Failed to save devotion." });
        }
      } catch (err) {
        setIsSaved(false); // rollback
        console.error("Save error:", err);
        alert("Error saving devotion");
      }
    } else {
      // --- REMOVE devotion ---
      setIsSaved(false); // update UI instantly
      try {
        const response = await apiClient(
          `/saved/${payload.item_type}/${userData.id}/${topic.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          Toast.show({
            type: "success",
            text1: "Devotion removed from saved!",
          });
        } else {
          setIsSaved(true); // rollback
          Toast.show({
            type: "error",
            text1: "Failed to remove saved devotion.",
          });
        }
      } catch (error) {
        setIsSaved(true); // rollback
        console.error("Delete error:", error);
      }
    }
  };

  const content = topic.message;
  // const content =
  //   topic.days && topic.days[day] ? topic.days[day].message : topic.message;

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

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.contentCard}>
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
  scrollContent: { paddingBottom: 40 },
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
  content: { fontSize: 16, color: "#1b4a7aff", lineHeight: 22 },
});
