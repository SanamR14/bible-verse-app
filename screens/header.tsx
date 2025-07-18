
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StackParamList } from '../navigation/LandingStack';
import { MenuStackParamList } from '../Stack/MenuStack';

export default function Header (){
  const navigation = useNavigation<NativeStackNavigationProp<MenuStackParamList>>();
  return (
    <View style={styles.container}>
      <Icon name="users" size={22} />
      <Text style={styles.title}>FYI - For Your Inner Man</Text>
      <View style={styles.rightIcons}>
        <Icon name="bell" size={22} style={styles.icon} />
        <TouchableOpacity onPress={() => navigation.navigate('MenuStack')}>
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
    backgroundColor: '#ffffff',
    paddingTop: 50
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


