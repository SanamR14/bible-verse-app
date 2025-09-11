import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient, apiClientGet } from "../../apiClient";

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const [isPrivate, setIsPrivate] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Fetch user details on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userD = await AsyncStorage.getItem("userData");
        if (userD) {
          const parsedUser = JSON.parse(userD);
          const userData = await apiClientGet(`/auth/${parsedUser.id}`);
          setUser(userData);
          setIsPrivate(parsedUser.is_private); // Set toggle based on DB value
          console.log(parsedUser.is_private);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  // 🔹 Handle toggle change
  const handleTogglePrivacy = async (value: boolean) => {
    if (!user) return;
    setIsPrivate(value);
    setSaving(true);

    try {
      await apiClient(`/auth/${user.id}/privacy`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_private: value }),
      });
      setUser({ ...user, is_private: value });
    } catch (err) {
      console.error("Failed to update privacy:", err);
      Alert.alert("Error", "Failed to update privacy setting.");
      setIsPrivate(!value); // Revert toggle if update fails
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#90a9afff" />
      </SafeAreaView>
    );
  }

  const getInitials = () => {
    if (!user?.name) return "";
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1b4b7aff" />
        </Pressable>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatar}>
        {Platform.OS === "web" && (
          <Text style={styles.avatarText}>{getInitials()}</Text>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name: {user?.name || "-"}</Text>
        <Text style={styles.label}>Email: {user?.email || "-"}</Text>
        <Text style={styles.label}>City: {user?.city || "-"}</Text>

        {/* Privacy Toggle */}
        <View style={styles.privateRow}>
          <Text style={styles.label}>
            Private account {saving && "(Saving...)"}
          </Text>
          <Switch
            value={isPrivate}
            onValueChange={handleTogglePrivacy}
            trackColor={{ false: "#ECF0F1", true: "#1b4b7aff" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    ...Platform.select({
      ios: { fontWeight: "600" },
      android: { fontWeight: "700" },
      web: { fontWeight: "500" },
    }),
    color: "#1b4b7aff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#fff" },
  infoContainer: { marginTop: 30, paddingHorizontal: 20 },
  label: { fontSize: 16, marginBottom: 20, color: "#1b4b7aff" },
  privateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
});

export default Profile;
