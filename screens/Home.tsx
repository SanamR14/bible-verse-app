import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import VerseCard from './VerseCard';


export default function Header() {
  return (
        <PaperProvider>
         <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll}>
           <VerseCard />
          </ScrollView>
         </SafeAreaView>
        </PaperProvider>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
    scroll: {
    padding: 16,
  }
});