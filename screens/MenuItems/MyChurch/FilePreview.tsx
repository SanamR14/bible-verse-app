// FilePreview.tsx

import React, { useMemo } from "react";
import {
  View,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function FilePreview({ route }) {
  const { fileUrl } = route.params;

  // ⛔ DO NOT IMPORT react-native-pdf at top level!
  const PDFView = useMemo(() => {
    if (Platform.OS === "web") return null;

    try {
      // Only load react-native-pdf on Android/iOS
      const pdf = require("react-native-pdf").default;
      return pdf;
    } catch (e) {
      console.log("PDF module not available", e);
      return null;
    }
  }, []);

  if (!fileUrl) {
    return (
      <View style={styles.center}>
        <Text>No file to display</Text>
      </View>
    );
  }

  // 🌐 WEB — use an iframe to preview
  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1 }}>
        <iframe
          src={fileUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </View>
    );
  }

  // 📱 NATIVE — show PDF viewer
  if (!PDFView) {
    return (
      <View style={styles.center}>
        <Text>PDF viewer not available</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#1b4b7aff" />
      </TouchableOpacity> */}
      <PDFView
        source={{ uri: fileUrl }}
        style={{ flex: 1 }}
        onError={(err: any) => console.log("PDF error:", err)}
        renderActivityIndicator={() => (
          <ActivityIndicator size="large" color="#1b4b7aff" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
