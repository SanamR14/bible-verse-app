import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DevotionStackParamList } from '../../Stack/DevotionsStack';


const topics = Array.from({ length: 18 }, (_, i) => `Topic ${i + 1}`);

export default function Devotions() {
  const navigation = useNavigation<NativeStackNavigationProp<DevotionStackParamList>>();
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.topicButton} onPress={() => navigation.navigate('Topic', { topic: item })}>
      <Text style={styles.topicText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text>Search</Text>
        <Icon name="sliders" size={16} />
      </View>

      <FlatList
        data={topics}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontWeight: 'bold', fontSize: 16 },
  icons: { flexDirection: 'row', gap: 12 },
  icon: { marginRight: 8 },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  row: { justifyContent: 'space-between' },
  topicButton: {
    backgroundColor: '#fdf6ee',
    flex: 0.48,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  topicText: {
    color: '#333',
  },
});
