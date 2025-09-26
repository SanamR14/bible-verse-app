import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { apiClientGet } from "../../apiClient";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

export default function CalendarScreen({ route, navigation }) {
  const layout = useWindowDimensions();
  const { user } = route.params;

  // 🔹 If user has no church → block access
  // if (!user.church) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.noChurch}>
  //         <Text style={styles.noChurchText}>
  //           You are not assigned to a church. Please contact admin.
  //         </Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  const [events, setEvents] = useState<any[]>([]);
  const [myRota, setMyRota] = useState<any[]>([]);
  const [teamRota, setTeamRota] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});

  // 🔹 Today by default
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "events", title: "Events" },
    { key: "myrota", title: user.name + " your rota" },
    { key: "teamrota", title: user.church + " rota" },
  ]);

  const normalizeDate = (dateStr: string) =>
    dateStr ? dateStr.split("T")[0] : "";

  // Fetch events for this church
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiClientGet(`/churchevent/${user.church}`);
        setEvents(data);

        const marks: any = {};
        data.forEach((e: any) => {
          const day = normalizeDate(e.event_date);
          if (day) marks[day] = { marked: true, dotColor: "blue" };
        });
        setMarkedDates((prev: any) => ({ ...prev, ...marks }));
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, [user.church]);

  // Fetch my rota
  useEffect(() => {
    const fetchMyRota = async () => {
      try {
        const data = await apiClientGet(`/churchrota/member/${user.id}`);
        setMyRota(data);

        const marks: any = {};
        data.forEach((r: any) => {
          const day = normalizeDate(r.rota_date);
          if (day) marks[day] = { marked: true, dotColor: "green" };
        });
        setMarkedDates((prev: any) => ({ ...prev, ...marks }));
      } catch (err) {
        console.error("Failed to fetch my rota:", err);
      }
    };
    fetchMyRota();
  }, [user.id]);

  // Fetch all rota for this church
  useEffect(() => {
    const fetchTeamRota = async () => {
      try {
        const data = await apiClientGet(`/churchrota/all/${user.church}`);
        setTeamRota(data);

        const marks: any = {};
        data.forEach((r: any) => {
          const day = normalizeDate(r.rota_date);
          if (day) marks[day] = { marked: true, dotColor: "purple" };
        });
        setMarkedDates((prev: any) => ({ ...prev, ...marks }));
      } catch (err) {
        console.error("Failed to fetch team rota:", err);
      }
    };
    fetchTeamRota();
  }, [user.church]);

  // Filtered Data
  const filteredEvents = useMemo(
    () => events.filter((e) => normalizeDate(e.event_date) === selectedDate),
    [events, selectedDate]
  );

  const filteredMyRota = useMemo(
    () => myRota.filter((r) => normalizeDate(r.rota_date) === selectedDate),
    [myRota, selectedDate]
  );

  const filteredTeamRota = useMemo(
    () => teamRota.filter((r) => normalizeDate(r.rota_date) === selectedDate),
    [teamRota, selectedDate]
  );

  // 🔹 Tab Content
  const EventsRoute = () => (
    <ScrollView style={styles.list}>
      {filteredEvents.length ? (
        filteredEvents.map((e) => (
          <View key={e.id} style={styles.item}>
            <Text style={styles.title}>{e.title}</Text>
            <Text>
              {normalizeDate(e.event_date)} {e.event_time}
            </Text>
            {e.description && <Text>{e.description}</Text>}
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No events for this date</Text>
      )}
    </ScrollView>
  );

  const MyRotaRoute = () => (
    <ScrollView style={styles.list}>
      {filteredMyRota.length ? (
        filteredMyRota.map((r) => (
          <View key={r.id} style={styles.item}>
            <Text style={styles.title}>{r.duty}</Text>
            <Text>
              {normalizeDate(r.rota_date)} {r.rota_time}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No rota for this date</Text>
      )}
    </ScrollView>
  );

  const TeamRotaRoute = () => (
    <ScrollView style={styles.list}>
      {filteredTeamRota.length ? (
        filteredTeamRota.map((r) => (
          <View key={r.id} style={styles.item}>
            <Text style={styles.title}>{r.duty}</Text>
            <Text>
              {normalizeDate(r.rota_date)} {r.rota_time}
            </Text>
            <Text>{r.member_name}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No team rota for this date</Text>
      )}
    </ScrollView>
  );

  const renderScene = SceneMap({
    events: EventsRoute,
    myrota: MyRotaRoute,
    teamrota: TeamRotaRoute,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1b4b7aff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text></Text>
      </View>
      <RNCalendar
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: "#1b4a7aff",
            marked: markedDates[selectedDate]?.marked,
            dotColor: markedDates[selectedDate]?.dotColor,
          },
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          todayTextColor: "red",
          selectedDayBackgroundColor: "#1b4a7aff",
          arrowColor: "#1b4a7aff",
        }}
      />

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
            labelStyle={{ fontWeight: "600", fontSize: 16 }}
            activeColor="#1b4a7aff"
            inactiveColor="gray"
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  list: { padding: 10 },
  item: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#ECF0F1",
    borderRadius: 8,
  },
  title: { fontWeight: "bold", marginBottom: 4 },
  empty: { textAlign: "center", marginTop: 20, color: "gray" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b4b7aff",
  },
});
