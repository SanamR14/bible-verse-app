// src/screens/DayScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { DevotionStackParamList } from '../../Stack/DevotionsStack';



export default function DayScreen() {
  const route = useRoute<RouteProp<DevotionStackParamList, 'Day'>>();
  const { topic, day } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{topic}</Text>
      <View style={styles.contentCard}>
        <Text style={styles.dayTitle}>Day - {day}</Text>
        {/* You can replace this with actual devotion content */}
        <Text style={styles.content}>This is devotion content for Day {day} of {topic}.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  contentCard: {
    backgroundColor: '#fcf8f2',
    padding: 16,
    borderRadius: 12,
  },
  dayTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  content: { fontSize: 14 },
});
