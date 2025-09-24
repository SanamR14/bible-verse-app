import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClientGet } from "../../apiClient";

export default function Members() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndUsers = async () => {
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
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDataAndUsers();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
          <Text>{item.email}</Text>
          <Text>
            {item.church} - {item.city}, {item.country}
          </Text>
        </View>
      )}
      ListEmptyComponent={<Text>No Members found for this church.</Text>}
    />
  );
}
