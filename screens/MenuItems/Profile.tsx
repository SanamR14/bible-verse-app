import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const [isPrivate, setIsPrivate] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f4a261" />
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

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <View style={styles.avatar}>
        {Platform.OS === "web" && (
          <Text style={styles.avatarText}>{getInitials()}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name: {user?.name || "-"}</Text>
        <Text style={styles.label}>Email: {user?.email || "-"}</Text>
        <Text style={styles.label}>City: {user?.city || "-"}</Text>

        <View style={styles.privateRow}>
          <Text style={styles.label}>Private account</Text>
          <Switch value={isPrivate} onValueChange={setIsPrivate} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9F9",
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
    color: "#000",
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
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  infoContainer: { marginTop: 30, paddingHorizontal: 20 },
  label: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  privateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
});

export default Profile;
