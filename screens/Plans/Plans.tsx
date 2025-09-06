import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { PlansStackParamList } from "../../Stack/PlansStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { apiClient, apiClientGet } from "../../apiClient";

export type Plan = {
  id: number;
  title: string;
  message: string;
  outertitle: string;
  author: string;
  image?: string;
  days: null | Array<{
    title: string;
    message: string;
  }>;
};
export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<PlansStackParamList>>();

  const fetchPlans = async () => {
    try {
      const response = await apiClientGet(
        "/plans/"
      );
      const data = await response;
      setPlans(data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    setFilteredData(plans);
  }, [plans]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(item.days ? "Plans_Topic" : "Plans_Day", {
            topic: item,
          })
        }
      >
        <Text style={styles.title}>{item.outertitle}</Text>
        <Text style={styles.by}>{item.author}</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredData(plans);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = plans.filter((item) =>
        item.outertitle.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(plans);
  return (
    <View style={styles.container}>
      {/* <View style={styles.searchBar}>
        <Text> Search</Text>
      </View> */}

      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
        underlineColor="transparent"
      style={styles.searchInput}
        theme={{
          colors: {
            primary: "transparent",
          },
        }}
        textColor="#1b4b7aff"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#999" />
      ) : (
        <FlatList
          renderItem={renderItem}
          data={filteredData}
          keyExtractor={(item) => item.id?.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFFFFF" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { justifyContent: "space-between" },
  card: {
    flex: 0.48,
    backgroundColor: "#ECF0F1",
    marginBottom: 16,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    elevation: 2,
  },
  image: { width: "100%", height: 100, borderRadius: 10 },
  title: {
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
    color: "#1b4b7aff",
  },
  by: { color: "#1b4a7a65", fontSize: 12, textAlign: "center" },
  searchInput: {
    height: 40,
    backgroundColor: "#fff", // clean input
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    color: "#1b4b7aff",
  },
});
