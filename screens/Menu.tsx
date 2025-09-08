import React from "react";
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
  faPersonPraying,
  faLinkSlash,
  faQuestion,
  faLanguage,
  faShareFromSquare,
  faArrowRightFromBracket,
  faBell,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { MenuStackParamList } from "../Stack/MenuStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

export default function Menu() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MenuStackParamList>>();

  const logout = async (navigation: any) => {
    try {
      await AsyncStorage.clear();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        })
      );
    } catch (error) {
      console.error("Error clearing token:", error);
      Alert.alert("Logout Failed", "Unable to clear session.");
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
              onPress={() => navigation.navigate("Quiz")}
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

            <TouchableOpacity
              style={styles.item}
              onPress={() => logout(navigation)}
            >
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
    backgroundColor: "#FFFFFF", // light neutral
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
    color: "#1b4a7aff", // primary
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
    elevation: 2, // Android shadow
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
    color: "#1b4a7aff", // primary
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
    color: "#27AE60", // secondary for logout
    fontWeight: "600",
  },
});
