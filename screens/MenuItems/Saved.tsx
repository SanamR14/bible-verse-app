import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

export default function SavedPage() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const [userid, setUserid] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    const user = await AsyncStorage.getItem("userData");
    if (!user) return;
    const userData = JSON.parse(user);
    setUserid(userData.id);
    try {
      const res = await fetch(
        `https://bible-verse-backend-1kvo.onrender.com/saved/${userData.id}`
      );
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#1b4b7aff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Items</Text>
          <Text></Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#999" />
        ) : (
          <View>
            {items.length === 0 ? (
              <Text>No saved items yet.</Text>
            ) : (
              <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("Day", {
                        topic: item,
                      })
                    }
                    style={styles.item}
                  >
                    <Text style={styles.title}>{item.title}</Text>
                    {/* <Text numberOfLines={2} style={styles.preview}>
                    {item.content}
                  </Text> */}
                  </Pressable>
                )}
              />
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  item: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontSize: 16, fontWeight: "600", color: "#1b4b7aff" },
  preview: { color: "#1b4b7aff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b4b7aff",
  },
});
