import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerseCard: React.FC = () => {
  // const [verseData, setVerseData] = useState<{
  //   verse: string;
  //   public_id: string;
  //   image_url: string;
  // } | null>(null);

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchVerse();
  // }, []);

  // const fetchVerse = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/bibleverse/');
  //     setVerseData(response.data[0]);
  //   } catch (err) {
  //     console.error('Unable to load verse.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#555" />;
  // }

  // if (!verseData) {
  //   return <Text>Could not load verse.</Text>;
  // }

  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState<string | ''>();
  const [loading, setLoading] = useState(true);
  const [user, setData] = useState<any>(null);

    useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) setData(JSON.parse(userData));
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:3000/bibleverse/'); // Replace with your API
      const data = await response.json();
      setImages(data);
      updateImage(data);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateImage = (imageArray: any[]) => {
    const today = new Date();
    const dayIndex = today.getDate() + today.getMonth() * 31 + today.getFullYear();
   // const dayIndex = today.getHours() * 60 + today.getMinutes();
    const index = dayIndex % imageArray.length;
    setImageUrl(imageArray[index]?.image_url); // Make sure your API returns `url`
  };

  useEffect(() => {
    fetchImages();
  }, []);

    if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  return (
    <View>
      <Text style={styles.subtitle}>Today’s word for you {user?.name}</Text>
      <View style={styles.card}>
        <Image
          source={{ uri: imageUrl }}
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
