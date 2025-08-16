import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useVerseCard } from "./VerseCard.shared";

export default function VerseCardIOS() {
  const { user, imageUrl, loading } = useVerseCard();

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <View>
      <Text style={styles.subtitle}>Today’s word for you {user?.name}</Text>
      <View style={styles.card}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 18, marginBottom: 10, fontWeight: "600" },
  card: { alignItems: "center", borderRadius: 20, overflow: "hidden" },
  image: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").width * 0.9,
    borderRadius: 20,
  },
});
