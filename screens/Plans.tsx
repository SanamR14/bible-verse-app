// src/screens/PlansScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const data = [
  { id: '1', title: 'PAIN', by: 'FYI Ministries', image: 'https://via.placeholder.com/150' },
  { id: '2', title: 'Are you worried?', by: 'FYI Ministries', image: 'https://via.placeholder.com/150' },
  { id: '3', title: 'What are you searching?', by: 'FYI Ministries', image: 'https://via.placeholder.com/150' },
  { id: '4', title: 'Want to be a leader?', by: 'FYI Ministries', image: 'https://via.placeholder.com/150' },
];

export default function Plans() {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.by}>{item.by}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>FYI - Build Your Inner Man</Text> */}

      <View style={styles.searchBar}>
        <Text> Search</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  searchBar: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  row: { justifyContent: 'space-between' },
  card: {
    flex: 0.48,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  image: { width: '100%', height: 100, borderRadius: 10 },
  title: { fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
  by: { color: '#555', fontSize: 12, textAlign: 'center' },
});
