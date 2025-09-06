import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { apiClient } from "../../../apiClient";

type TestimonyModalProps = {
  visible: boolean;
  onClose: () => void;
  userId: number | null;
};

const TestimonyModal: React.FC<TestimonyModalProps> = ({
  visible,
  onClose,
  userId,
}) => {
  const [prayerName, setPrayerName] = useState("");
  const [testimony, setTestimony] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dialog, setDialog] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  const handleSave = async () => {
    if (!prayerName || !testimony) {
      setDialog({ visible: true, message: "Please fill in both fields." });
      return;
    }

    const user = await AsyncStorage.getItem("userData");
    if (!user) {
      setDialog({
        visible: true,
        message: "Session expired. Please log in again.",
      });
      return;
    }

    const userData = JSON.parse(user);

    try {
      const response = await apiClient(
        "/testimonies",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userid: userId,
            username: isAnonymous ? "Anonymous" : userData.name,
            prayer: prayerName,
            testimony: testimony,
          }),
        }
      );

      if (response.ok) {
        setDialog({
          visible: true,
          message: "Your testimony has been saved!",
        });
        setPrayerName("");
        setTestimony("");
      } else {
        setDialog({ visible: true, message: "Failed to save testimony." });
      }
    } catch (error) {
      console.error("Save testimony error:", error);
      setDialog({ visible: true, message: "Something went wrong." });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Add Testimony</Text>

            <TextInput
              placeholder="Write about your prayer in few words"
              placeholderTextColor="#A9A9A9"
              value={prayerName}
              onChangeText={setPrayerName}
              style={styles.input}
            />

            <TextInput
              placeholder="Write about your testimony how GOD made it happen"
              placeholderTextColor="#A9A9A9"
              value={testimony}
              onChangeText={setTestimony}
              multiline
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            />

            <View style={styles.privateRow}>
              <Text style={styles.label}>Anonymous Prayer Request</Text>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: "#ECF0F1", true: "#1b4b7aff" }}
              />
            </View>

            {dialog.visible && (
              <View style={styles.dialogBox}>
                <Text style={styles.dialogText}>{dialog.message}</Text>

                {dialog.message === "Your testimony has been saved!" ? (
                  <Pressable style={styles.dialogBtn} onPress={onClose}>
                    <Text style={styles.dialogBtnText}>OK</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.dialogBtn}
                    onPress={() => setDialog({ visible: false, message: "" })}
                  >
                    <Text style={styles.dialogBtnText}>OK</Text>
                  </Pressable>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Pressable style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>

              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default TestimonyModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b4b7a",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    color: "#1b4b7aff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  privateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  label: { fontSize: 16, color: "#1b4b7aff" },
  saveBtn: {
    flex: 1,
    backgroundColor: "#1b4b7a",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  dialogBox: {
    backgroundColor: "#f0f8ff",
    borderColor: "#1b4b7a",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  dialogText: {
    fontSize: 15,
    color: "#1b4b7a",
    marginBottom: 8,
    textAlign: "center",
  },
  dialogBtn: {
    backgroundColor: "#1b4b7a",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  dialogBtnText: {
    color: "#fff",
    fontSize: 14,
  },
});
