import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';

const VerseCard: React.FC = () => {
//   const [verse, setVerse] = useState<string | null>(null);
//   const [public_id, setPublicid] = useState<string | null>(null);
  const [verseData, setVerseData] = useState<{
    verse: string;
    public_id: string;
    image_url: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerse();
  }, []);

  const fetchVerse = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bibleverse/');
      setVerseData(response.data[0]);
    } catch (err) {
      console.error('Unable to load verse.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#555" />;
  }

  if (!verseData) {
    return <Text>Could not load verse.</Text>;
  }

  return (
    <View>
      <Text style={styles.subtitle}>Today’s word for you</Text>
      <View style={styles.card}>
        <Image
          source={{ uri: verseData.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* <View style={styles.textOverlay}>
          <Text style={styles.verse}>{verseData.verse}</Text>
          <Text style={styles.reference}>{verseData.reference}</Text>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '500',
  },
  card: {
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.9,
    borderRadius: 20,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
  },
  verse: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  reference: {
    color: '#ddd',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default VerseCard;
