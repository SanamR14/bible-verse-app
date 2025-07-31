import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const [isPrivate, setIsPrivate] = useState(false);
  const [user, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) setData(JSON.parse(userData));
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> My Profile</Text>
        <Text></Text>
      </View>

      <View style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name: {user?.name || "-"}</Text>
        <Text style={styles.label}>Email: {user?.email || "-"}</Text>
        <Text style={styles.label}>City : {user?.city || "-"}</Text>
        {/* <Text style={styles.label}>Fellowships</Text> */}
        <View style={styles.privateRow}>
          <Text style={styles.label}>Private account</Text>
          <Switch
            style={styles.btn}
            value={isPrivate}
            onValueChange={setIsPrivate}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginLeft: -40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginTop: -10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  infoContainer: { marginTop: 50, paddingHorizontal: 20 },
  label: { fontSize: 16, marginBottom: 25 },
  privateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: { marginTop: -23 },
});

export default Profile;
