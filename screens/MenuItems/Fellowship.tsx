import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { apiClientGet } from "../../apiClient";
import { User } from "../../types";
import UserCard from "../Card/UserCard";

export default function Fellowship({ navigation }: any) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const currentUserData = await AsyncStorage.getItem("userData");
      const currentUsername = currentUserData
        ? JSON.parse(currentUserData).name
        : "";

      const res = await apiClientGet("/auth");
      const filtered = (res || []).filter(
        (u: User) => !u.is_private && u.name !== currentUsername
      );
      setUsers(filtered);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      Alert.alert("Error", "Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const visibleUsers = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleConnect = (user: User) => {
    Alert.alert("Connect", `You connected with ${user.name}`);
  };

  const handleDismiss = (user: User) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#1b4b7aff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fellowship</Text>
          <Text />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
        </View>

        <Text style={styles.title}>People you may know</Text>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingBottom: 120,
              }}
              data={visibleUsers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <UserCard
                  user={item}
                  onConnect={handleConnect}
                  onDismiss={handleDismiss}
                />
              )}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              ListEmptyComponent={() => (
                <View style={{ alignItems: "center", marginTop: 40 }}>
                  <Text style={{ color: "#666" }}>No suggestions</Text>
                </View>
              )}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1b4b7aff",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e6eefc",
  },
  searchInput: { fontSize: 15, padding: 0 },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    marginBottom: 8,
    color: "#1b4b7aff",
  },
});
