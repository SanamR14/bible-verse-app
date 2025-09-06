import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { apiClient } from "../../apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createMaterialTopTabNavigator();

type TestimonyItem = {
  id: number;
  userid: number;
  username: string;
  prayer: string;
  testimony: string;
};

function AnsweredPrayersScreen({ data }: { data: TestimonyItem[] }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={data.filter((item) => item.prayer)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.prayer}</Text>
          </View>
        )}
      />
    </View>
  );
}

function TestimoniesScreen({ data }: { data: TestimonyItem[] }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={data.filter((item) => item.testimony)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.testimony}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default function PrayerAndTestimonyTabs() {
  const navigation = useNavigation();
  const [data, setData] = useState<TestimonyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonies = async () => {
      try {
        const user = await AsyncStorage.getItem("userData");
        if (!user) {
          Alert.alert("Session Expired", "Please log in again.");
          setLoading(false);
          return;
        }

        const userData = JSON.parse(user);

        const response = await apiClient(
          `https://bible-verse-backend-1kvo.onrender.com/testimonies/${userData.id}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching testimonies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonies();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1b4b7aff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#1b4b7aff" />
          </Pressable>
          <Text style={styles.headerTitle}>FYI - For Your Inner Man</Text>
          <Text></Text>
        </View>

        {/* Tabs */}
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
            tabBarStyle: { backgroundColor: "#f2f2f2" },
            tabBarActiveTintColor: "#1b4b7aff",
            tabBarIndicatorStyle: { backgroundColor: "#1b4b7aff", height: 3 },
          }}
        >
          <Tab.Screen name="Answered Prayers">
            {() => <AnsweredPrayersScreen data={data} />}
          </Tab.Screen>
          <Tab.Screen name="Testimony">
            {() => <TestimoniesScreen data={data} />}
          </Tab.Screen>
        </Tab.Navigator>
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
    marginBottom: 16,
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
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: "#1b4b7aff",
    fontWeight: "500",
  },
  subText: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
});
