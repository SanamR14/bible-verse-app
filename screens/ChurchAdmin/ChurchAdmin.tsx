import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClientGet } from "../../apiClient";

export default function Menu() {
  const navigation = useNavigation();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (!storedData) return;

      const { church, city, country } = JSON.parse(storedData);

      const data = await apiClientGet(
        `/auth/churchfilter/users?church=${encodeURIComponent(
          church
        )}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(
          country
        )}`
      );
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#1b4a7aff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Admin</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="menu" size={24} color="#1b4a7aff" />
            </TouchableOpacity>
          </View>

          <View style={styles.contentBox}>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Members", { membersData: members })
              }
            >
              <FontAwesomeIcon
                icon={faUser}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Church Members</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1b4a7aff",
  },
  contentBox: {
    backgroundColor: "#ECF0F1",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    margin: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#1b4a7aff",
    fontWeight: "500",
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#90a9afff",
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: "#27AE60",
    fontWeight: "600",
  },
});
