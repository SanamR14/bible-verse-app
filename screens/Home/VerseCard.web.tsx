import React from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useVerseCard } from "./VerseCard.shared";
import { Dimensions } from "react-native";

export default function VerseCardWeb() {
  const { user, imageUrl, loading } = useVerseCard();

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Today’s word for you {user?.name}</Text>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },
  subtitle: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "500",
    color: "#1b4b7aff",
  },
  image: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").width * 0.9,
    borderRadius: 20,
  },
});
