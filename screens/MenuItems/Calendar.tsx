import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { apiClientGet } from "../../apiClient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarScreen({ route }) {
  const layout = useWindowDimensions();
  const { user } = route.params;

  const [events, setEvents] = useState<any[]>([]);
  const [rota, setRota] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "events", title: "Events" },
    { key: "rota", title: "Rota" },
  ]);

  // 🔹 Helper to normalize backend date ("2025-09-28T00:00:00.000Z" -> "2025-09-28")
  const normalizeDate = (dateStr: string) =>
    dateStr ? dateStr.split("T")[0] : "";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiClientGet("/churchevent");
        setEvents(data);

        const marks: any = {};
        data.forEach((e: any) => {
          const day = normalizeDate(e.event_date);
          if (day) {
            marks[day] = { marked: true, dotColor: "blue" };
          }
        });
        setMarkedDates((prev: any) => ({ ...prev, ...marks }));
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRota = async () => {
      try {
        const data = await apiClientGet(`/churchrota/member/${user.id}`);
        setRota(data);

        const marks: any = {};
        data.forEach((r: any) => {
          const day = normalizeDate(r.rota_date);
          if (day) {
            marks[day] = { marked: true, dotColor: "green" };
          }
        });
        setMarkedDates((prev: any) => ({ ...prev, ...marks }));
      } catch (err) {
        console.error("Failed to fetch rota:", err);
      }
    };
    fetchRota();
  }, []);

  // 🔹 Filter events & rota for clicked date
  const filteredEvents = selectedDate
    ? events.filter((e) => normalizeDate(e.event_date) === selectedDate)
    : [];
  const filteredRota = selectedDate
    ? rota.filter((r) => normalizeDate(r.rota_date) === selectedDate)
    : [];

  const EventsRoute = () => (
    <ScrollView style={styles.list}>
      {filteredEvents.map((e) => (
        <View key={e.id} style={styles.item}>
          <Text style={styles.title}>{e.title}</Text>
          <Text>
            {normalizeDate(e.event_date)} {e.event_time}
          </Text>
          {e.description && <Text>{e.description}</Text>}
        </View>
      ))}
      {filteredEvents.length === 0 && (
        <Text style={styles.empty}>No events for this date</Text>
      )}
    </ScrollView>
  );

  const RotaRoute = () => (
    <ScrollView style={styles.list}>
      {filteredRota.map((r) => (
        <View key={r.id} style={styles.item}>
          <Text style={styles.title}>{r.duty}</Text>
          <Text>
            {normalizeDate(r.rota_date)} {r.rota_time}
          </Text>
          <Text>{r.member_name}</Text>
        </View>
      ))}
      {filteredRota.length === 0 && (
        <Text style={styles.empty}>No rota for this date</Text>
      )}
    </ScrollView>
  );

  const renderScene = SceneMap({
    events: EventsRoute,
    rota: RotaRoute,
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Calendar */}
      <RNCalendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              selected: true,
              selectedColor: "#1b4a7aff",
              marked: markedDates[selectedDate]?.marked,
              dotColor: markedDates[selectedDate]?.dotColor,
            },
          }),
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          todayTextColor: "red",
          selectedDayBackgroundColor: "#1b4a7aff",
          arrowColor: "#1b4a7aff",
        }}
      />

      {/* Tabs */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#1b4a7aff", height: 3 }}
            style={{ backgroundColor: "#fff", elevation: 2 }}
            labelStyle={{
              fontWeight: "600",
              fontSize: 16,
            }}
            activeColor="#1b4a7aff"
            inactiveColor="gray"
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 10 },
  item: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  title: { fontWeight: "bold", marginBottom: 4 },
  empty: { textAlign: "center", marginTop: 20, color: "gray" },
  card: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
