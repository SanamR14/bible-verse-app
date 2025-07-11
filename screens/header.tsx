// components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function Header ({ navigation }: any){
  return (
    <View style={styles.container}>
      <Icon name="users" size={22} />
      <Text style={styles.title}>FYI - For Your Inner Man</Text>
      <View style={styles.rightIcons}>
        <Icon name="bell" size={22} style={styles.icon} />
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
        <Icon name="menu" size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
  },
});


