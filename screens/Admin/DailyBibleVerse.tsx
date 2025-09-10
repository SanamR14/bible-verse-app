import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { apiClient } from "../../apiClient";

export default function DailyBibleVerse() {
  const [imageUrl, setImageUrl] = useState("");
  const [id, setId] = useState(""); // 👈 ID of verse to update
  const [upgImageUrl, setUpgImageUrl] = useState(""); // 👈 new URL to update

  const handleSubmit = async () => {
    if (!imageUrl.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter an image URL",
      });
      return;
    }

    try {
      const response = await apiClient("/bibleverse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || "Failed to save");

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Verse image saved!",
      });
      setImageUrl(""); // reset input after success
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message || "Something went wrong",
      });
    }
  };

  const handleUpdate = async () => {
    if (!id.trim() || !upgImageUrl.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Data",
        text2: "Please enter both ID and URL.",
      });
      return;
    }

    try {
      const response = await apiClient("/bibleverse", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, image_url: upgImageUrl }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data?.error || "Failed to update verse");

      Toast.show({
        type: "success",
        text1: "Updated",
        text2: "Daily Bible Verse updated successfully.",
      });

      setId("");
      setUpgImageUrl("");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message || "Something went wrong.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Daily Bible Verse</Text>
      <TextInput
        style={styles.input}
        placeholder="Paste Image URL here"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Update Daily Bible Verse</Text>

      {/* ID Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Verse ID"
        value={id}
        onChangeText={setId}
        keyboardType="numeric"
      />

      {/* URL Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter New Image URL"
        value={upgImageUrl}
        onChangeText={setUpgImageUrl}
      />

      {/* Update Button */}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Verse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1b4b7aff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#1b4b7aff",
  },
  button: {
    backgroundColor: "#1b4b7aff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
