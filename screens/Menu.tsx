import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faHandsPraying,
  faBookmark,
  faPeopleGroup,
  faLinkSlash,
  faQuestion,
  faLanguage,
  faShareFromSquare,
  faArrowRightFromBracket,
  faBell,
  faTrophy,
  faCalendar,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { MenuStackParamList } from "../Stack/MenuStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

export default function Menu() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MenuStackParamList>>();
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setUserData(parsed);
          setIsAdmin(parsed?.is_church_admin || false);
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };
    fetchUserData();
  }, []);
  const logout = async () => {
    try {
      if (userData?.id) {
        await fetch(
          "https://bible-verse-backend-1kvo.onrender.com/auth/logout",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userData.id }),
          }
        );
      }
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      await AsyncStorage.multiRemove(["userToken", "userData", "refreshToken"]);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        })
      );
    }
  };

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
              <Icon name="arrow-left" size={24} color="#1b4a7aff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="menu" size={24} color="#1b4a7aff" />
            </TouchableOpacity>
          </View>

          <View style={styles.contentBox}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("Profile", { topic: "" })}
            >
              <FontAwesomeIcon
                icon={faUser}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Profile</Text>
            </TouchableOpacity>
            {isAdmin && (
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
            )}

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("SavedStack", { topic: "" })}
            >
              <FontAwesomeIcon
                icon={faBookmark}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Saved Items</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("PrayerRequest", { topic: "" })
              }
            >
              <FontAwesomeIcon
                icon={faHandsPraying}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Prayer Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("Fellowship", { topic: "" })}
            >
              <FontAwesomeIcon
                icon={faPeopleGroup}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Fellowship</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("ForYou", { topic: "" })}
            >
              <FontAwesomeIcon
                icon={faLinkSlash}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Do you feel disconnected?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("ChristCommunity", { topic: "" })
              }
            >
              <FontAwesomeIcon
                icon={faPeopleGroup}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Christ Community</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("Testimonies", { topic: "" })}
            >
              <FontAwesomeIcon
                icon={faHandsPraying}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>
                Testimonies & Answered Prayers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("QuizStack")}
            >
              <FontAwesomeIcon
                icon={faTrophy}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Quiz Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("Notifications")}
            >
              <FontAwesomeIcon
                icon={faBell}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("Calendar")}
            >
              <FontAwesomeIcon
                icon={faCalendar}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <FontAwesomeIcon
                icon={faQuestion}
                size={20}
                color="#1b4a7aff"
                style={[styles.icon, styles.disabledItem]}
              />
              <Text style={[styles.itemText, styles.disabledText]}>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <FontAwesomeIcon
                icon={faLanguage}
                size={20}
                color="#1b4a7aff"
                style={[styles.icon, styles.disabledItem]}
              />
              <Text style={[styles.itemText, styles.disabledText]}>
                Language
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <FontAwesomeIcon
                icon={faShareFromSquare}
                size={20}
                color="#1b4a7aff"
                style={[styles.icon, styles.disabledItem]}
              />
              <Text style={[styles.itemText, styles.disabledText]}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => logout()}>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
              <Text style={styles.itemText}>Logout</Text>
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
