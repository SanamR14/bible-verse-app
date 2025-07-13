// src/screens/TopicScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DevotionStackParamList } from '../../Stack/DevotionsStack';


const days = Array.from({ length: 7 }, (_, i) => i + 1);

export default function Topic() {
  const route = useRoute<RouteProp<DevotionStackParamList, 'Topic'>>();
  const navigation = useNavigation<NativeStackNavigationProp<DevotionStackParamList>>();
  const { topic } = route.params;

  const renderItem = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={styles.dayButton}
      onPress={() => navigation.navigate('Day', { topic, day: item })}
    >
      <Icon name="calendar" size={20} />
      <Text style={styles.dayText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{topic}</Text>
      <Text style={styles.subtitle}>7 - Day Devotion</Text>

      <FlatList
        data={days}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />

      <TouchableOpacity style={styles.quizButton}>
        <Text style={styles.quizText}>Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 16 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  dayButton: {
    backgroundColor: '#fcf8f2',
    flex: 0.3,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  dayText: { marginTop: 8 },
  quizButton: {
    marginTop: 16,
    backgroundColor: '#fcf8f2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '30%',
  },
  quizText: { fontWeight: 'bold' },
});
