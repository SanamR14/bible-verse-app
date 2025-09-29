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
import {
  faCalendar,
  faCalendarPlus,
  faCircleUser,
  faPeopleGroup,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClientGet } from "../../../apiClient";

export default function MyChurch() {
  const navigation = useNavigation();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const fetchMembers = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setUserData(parsed);
        setIsAdmin(parsed?.is_church_admin || false);
      }
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
            <Text style={styles.headerTitle}>My Church</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="menu" size={24} color="#1b4a7aff" />
            </TouchableOpacity>
          </View>

          {isAdmin && (
            <View style={styles.contentBox}>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate("ChurchAdminStack")}
              >
                <FontAwesomeIcon
                  icon={faCircleUser}
                  size={20}
                  color="#1b4a7aff"
                  style={styles.icon}
                />
                <Text style={styles.itemText}>Admin</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.contentBox}>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Worship", { membersData: members })
              }
            >
              <FontAwesomeIcon
                icon={faPeopleGroup}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Worship</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentBox}>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Sermon", { membersData: members })
              }
            >
              <FontAwesomeIcon
                icon={faCalendarPlus}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Sermon</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentBox}>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("SundaySchool", { membersData: members })
              }
            >
              <FontAwesomeIcon
                icon={faCalendarPlus}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Sunday School</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentBox}>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("YoungAdults", { membersData: members })
              }
            >
              <FontAwesomeIcon
                icon={faCalendarPlus}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Young Adults</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentBox}>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Youth", { membersData: members })
              }
            >
              <FontAwesomeIcon
                icon={faCalendarPlus}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Youth</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentBox}>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Calendar", { user: userData })
              }
            >
              <FontAwesomeIcon
                icon={faCalendar}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Calendar & Events</Text>
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
    marginBottom: 7,
  },
  contentBox: {
    backgroundColor: "#ECF0F1",
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    margin: 7,
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
