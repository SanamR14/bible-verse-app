import React, { useState } from "react";
import { TextInput } from "react-native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export default function DevotionsAdmin() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [days, setDays] = useState(null);

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim() || !message.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter an image URL",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://bible-verse-backend-1kvo.onrender.com/devotions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            author: author,
            message: message,
            days: days,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || "Failed to save");

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Devotion saved!",
      });
      setTitle("");
      setAuthor("");
      setMessage("");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message || "Something went wrong",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Devotion</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Devotion Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Devotion Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        mode="outlined"
        multiline
        numberOfLines={50}
        maxLength={2000}
        value={message}
        onChangeText={setMessage}
        style={styles.textInput}
        placeholder="Enter the devotion message"
        textColor="#1b4b7aff"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
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
  textInput: {
    marginVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1b4b7aff",
  },
});
