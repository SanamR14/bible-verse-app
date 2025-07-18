// src/screens/PlansScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';

export default function Plans() {

  type Plan = {
  id: number;
  title: string;
  message: string;
  outerTitle?: string;
  author: string;
  image?: string;
};

 const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:3000/plans/');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.by}>{item.author}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#999" />
        <Text>Loading Plans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text> Search</Text>
      </View>

      <FlatList
        data={plans}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
