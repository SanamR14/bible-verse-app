import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput, Button } from "react-native-paper";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClientGet, apiClient } from "../../../apiClient";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import {
  sendPushToAll,
  sendPushToOne,
} from "../../../services/notificationsAPI";

export default function AddEventAndRota({ route }) {
  const navigation = useNavigation();

  const [selectedDateRota, setSelectedDateRota] = useState("");
  const [selectedTimeRota, setSelectedTimeRota] = useState("");
  const [showDatePickerRota, setShowDatePickerRota] = useState(false);
  const [showTimePickerRota, setShowTimePickerRota] = useState(false);

  const [selectedDateEvent, setSelectedDateEvent] = useState("");
  const [selectedTimeEvent, setSelectedTimeEvent] = useState("");
  const [showDatePickerEvent, setShowDatePickerEvent] = useState(false);
  const [showTimePickerEvent, setShowTimePickerEvent] = useState(false);

  const [rota, setRota] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [memberId, setMemberId] = useState("");
  const [duty, setDuty] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [userData, setUserData] = useState<any>(null);

  const { membersData } = route.params;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (!storedData) return;
        const parsed = JSON.parse(storedData);
        setUserData(parsed);
      } catch (err) {
        // const { church, city, country } = parsed;
        // const membersData = await apiClientGet(
        //   `/auth/churchfilter/users?church=${encodeURIComponent(
        //     church
        //   )}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(
        //     country
        //   )}`
        // );
        // setMembers(membersData);

        //   const rotaData = await apiClientGet(
        //     `/churchrota/monthrota/${new Date().toISOString().slice(0, 7)}`
        //   );
        //   setRota(rotaData);

        //   const eventsData = await apiClientGet("/churchevent");
        //   setEvents(eventsData);
        // }
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const addRota = async () => {
    if (!selectedDateRota || !memberId || !duty || !selectedTimeRota) {
      Alert.alert("Error", "Please fill all fields for Rota");
      return;
    }
    await apiClient("/churchrota/rota", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rota_date: selectedDateRota,
        rota_time: selectedTimeRota,
        member_id: memberId,
        duty,
        created_by: userData?.id,
      }),
    });

    Alert.alert("Success", "Rota saved successfully!");
    setDuty("");
    setMemberId("");
    setSelectedTimeRota("");
    setSelectedDateRota("");
    setShowDatePickerRota(false);
    setShowTimePickerRota(false);

    const month = new Date().toISOString().slice(0, 7);
    const rotaData = await apiClientGet(`/churchrota/monthrota?month=${month}`);
    setRota(rotaData);

    await sendPushToOne(
      memberId,
      `New Rota scheduled on ${selectedDateRota} at ${selectedTimeRota}`
    );

  };

  const addEvent = async () => {
    if (!selectedDateEvent || !eventTitle || !selectedTimeEvent) {
      Alert.alert("Error", "Please fill all fields for Event");
      return;
    }

    try {
      await apiClient("/churchevent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_date: selectedDateEvent,
          event_time: selectedTimeEvent,
          title: eventTitle,
          description: eventDescription,
          created_by: userData?.id,
        }),
      });

      Alert.alert("Success", "Event saved successfully!");
      setEventTitle("");
      setEventDescription("");
      setSelectedTimeEvent("");
      setSelectedDateEvent("");
      setShowDatePickerEvent(false);
      setShowTimePickerEvent(false);

      const eventsData = await apiClientGet("/churchevent");
      setEvents(eventsData);

      await sendPushToAll(
        `New Event scheduled on ${selectedDateEvent} at ${selectedTimeEvent}`
      );

    } catch (err) {
      console.error("Error adding event:", err);
      Alert.alert("Error", "Failed to save event");
    }
  };

  const onChangeDateRota = (event: Event, date?: Date) => {
    if (Platform.OS === "android") setShowDatePickerRota(false);
    if (date) setSelectedDateRota(date.toISOString().slice(0, 10));
  };

  const onChangeTimeRota = (event: Event, date?: Date) => {
    if (Platform.OS === "android") setShowTimePickerRota(false);
    if (date) {
      const h = date.getHours().toString().padStart(2, "0");
      const m = date.getMinutes().toString().padStart(2, "0");
      setSelectedTimeRota(`${h}:${m}`);
    }
  };

  const onChangeDateEvent = (event: Event, date?: Date) => {
    if (Platform.OS === "android") setShowDatePickerEvent(false);
    if (date) setSelectedDateEvent(date.toISOString().slice(0, 10));
  };

  const onChangeTimeEvent = (event: Event, date?: Date) => {
    if (Platform.OS === "android") setShowTimePickerEvent(false);
    if (date) {
      const h = date.getHours().toString().padStart(2, "0");
      const m = date.getMinutes().toString().padStart(2, "0");
      setSelectedTimeEvent(`${h}:${m}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header with Back Button */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 10 }}>
          {/* Rota Section */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#1b4a7aff" />
            </TouchableOpacity>
            <Text style={styles.sectionHeader}>Add Rota</Text>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Calendar", { user: userData })
              }
            >
              <FontAwesomeIcon
                icon={faCalendar}
                size={20}
                color="#1b4a7aff"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <Picker selectedValue={memberId} onValueChange={setMemberId}>
            <Picker.Item label="Select Member" value="" />
            {membersData.map((m) => (
              <Picker.Item key={m.id} label={m.name} value={m.id} />
            ))}
          </Picker>

          <TextInput
            label="Duty"
            value={duty}
            onChangeText={setDuty}
            mode="outlined"
            style={styles.input}
          />

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => setShowDatePickerRota(true)}
          >
            <Text style={styles.buttonText}>
              {selectedDateRota ? `Date: ${selectedDateRota}` : "Pick Date"}
            </Text>
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => setShowTimePickerRota(true)}
          >
            <Text style={styles.buttonText}>
              {selectedTimeRota ? `Time: ${selectedTimeRota}` : "Pick Time"}
            </Text>
          </Button>

          <Button mode="contained" style={styles.button} onPress={addRota}>
            <Text style={styles.buttonText}>Save Rota</Text>
          </Button>

          {showDatePickerRota && (
            <DateTimePicker
              value={selectedDateRota ? new Date(selectedDateRota) : new Date()}
              mode="date"
              display="default"
              onChange={onChangeDateRota}
            />
          )}
          {showTimePickerRota && (
            <DateTimePicker
              value={
                selectedTimeRota
                  ? new Date(`1970-01-01T${selectedTimeRota}:00`)
                  : new Date()
              }
              mode="time"
              display="default"
              onChange={onChangeTimeRota}
            />
          )}

          {/* Event Section */}
          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
            Add Event
          </Text>
          <TextInput
            label="Title"
            value={eventTitle}
            onChangeText={setEventTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={eventDescription}
            onChangeText={setEventDescription}
            multiline
            mode="outlined"
            style={[styles.input, { minHeight: 80 }]}
          />

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => setShowDatePickerEvent(true)}
          >
            <Text style={styles.buttonText}>
              {selectedDateEvent ? `Date: ${selectedDateEvent}` : "Pick Date"}
            </Text>
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => setShowTimePickerEvent(true)}
          >
            <Text style={styles.buttonText}>
              {selectedTimeEvent ? `Time: ${selectedTimeEvent}` : "Pick Time"}
            </Text>
          </Button>

          <Button mode="contained" style={styles.button} onPress={addEvent}>
            <Text style={styles.buttonText}>Save Event</Text>
          </Button>

          {showDatePickerEvent && (
            <DateTimePicker
              value={
                selectedDateEvent ? new Date(selectedDateEvent) : new Date()
              }
              mode="date"
              display="default"
              onChange={onChangeDateEvent}
            />
          )}
          {showTimePickerEvent && (
            <DateTimePicker
              value={
                selectedTimeEvent
                  ? new Date(`1970-01-01T${selectedTimeEvent}:00`)
                  : new Date()
              }
              mode="time"
              display="default"
              onChange={onChangeTimeEvent}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b4a7aff",
  },
  sectionHeader: { fontSize: 18, fontWeight: "700", marginVertical: 10 },
  input: { marginVertical: 10 },
  button: { marginVertical: 10, backgroundColor: "#1b4a7aff" },
  buttonText: { color: "#fff", fontWeight: "700" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#1b4a7aff",
    fontWeight: "500",
  },
});
