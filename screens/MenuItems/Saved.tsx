import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';


export default function Saved() {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved List</Text>
      </View>
       <FlatList
        data={savedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemAuthor}>by {item.author}</Text>
            </View>
            <Text style={styles.bookmark}>🔖</Text>
          </View>
        )}
      />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
    card: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 16, backgroundColor: '#fefefe',
    padding: 10, borderRadius: 12,
  },
  thumbnail: { width: 50, height: 50, borderRadius: 4, marginRight: 10 },
  itemTitle: { fontWeight: 'bold' },
  itemAuthor: { color: '#666' },
  bookmark: { fontSize: 20 },
});
