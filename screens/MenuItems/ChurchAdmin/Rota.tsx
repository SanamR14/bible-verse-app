import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { apiClientGet } from "../../../apiClient";

export default function RotaScreen({ navigation, route }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [rota, setRota] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { membersData } = route.params;
  const fetchRota = async (month: string) => {
    try {
      const data = await apiClientGet(`/churchrota/monthrota/${month}`);
      setRota(data);
    } catch (err) {
      console.error("Error fetching rota:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await apiClientGet("/churchevent");
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7);
    Promise.all([fetchRota(month), fetchEvents()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const filteredRota = selectedDate
    ? rota.filter((r) => r.rota_date?.startsWith(selectedDate))
    : [];
  const filteredEvents = selectedDate
    ? events.filter((e) => e.event_date?.startsWith(selectedDate))
    : [];

  // Mark dates with rota/events
  const markedDates = {
    ...(selectedDate && {
      [selectedDate]: {
        selected: true,
        selectedColor: "#1b4a7aff",
        marked: true,
      },
    }),
    ...rota.reduce((acc, item) => {
      acc[item.rota_date] = {
        marked: true,
        dotColor: "green",
      };
      return acc;
    }, {} as Record<string, any>),
    ...events.reduce((acc, item) => {
      acc[item.event_date] = {
        marked: true,
        dotColor: "blue",
      };
      return acc;
    }, {} as Record<string, any>),
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={{ flex: 1 }}>
      {/* Calendar */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: "red",
          selectedDayBackgroundColor: "#1b4a7aff",
          arrowColor: "#1b4a7aff",
        }}
      />

      {/* Events & Rota List */}
      <ScrollView style={{ flex: 1, padding: 10 }}>
        {selectedDate ? (
          <>
            {/* Events */}
            <Text style={styles.sectionTitle}>Events</Text>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((e) => (
                <View key={`event-${e.id}`} style={styles.item}>
                  <Text style={styles.title}>{e.title}</Text>
                  <Text>{e.event_time?.slice(0, 5)}</Text>
                  {e.description && <Text>{e.description}</Text>}
                </View>
              ))
            ) : (
              <Text style={styles.empty}>No events for this date</Text>
            )}

            {/* Rota */}
            <Text style={styles.sectionTitle}>Rota</Text>
            {filteredRota.length > 0 ? (
              filteredRota.map((r) => (
                <View key={`rota-${r.id}`} style={styles.item}>
                  <Text style={styles.title}>{r.duty}</Text>
                  <Text>{r.rota_time?.slice(0, 5)}</Text>
                  <Text>{r.member_name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.empty}>No rota for this date</Text>
            )}
          </>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Please select a date to view events and rota
          </Text>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddEventAndRota", { membersData })}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  item: {
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  empty: {
    textAlign: "center",
    marginBottom: 10,
    color: "gray",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#1b4a7aff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
});
