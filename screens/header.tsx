
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { MenuStackParamList } from '../Stack/MenuStack';

export default function Header (){
  const [title, setTitle] = useState('FYI - For Your Inner Man');

  const currentTab = useNavigationState((state) => {
    const tabState = state.routes.find(r => r.name === 'HomeStack')?.state;
    const currentRoute = tabState?.routes[tabState.index]?.name;

    return currentRoute;
  });

  useEffect(() => {
    switch (currentTab) {
      case 'Devotions':
        setTitle('FYI - Devotions');
        break;
      case 'Home':
        setTitle('FYI - For Your Inner Man');
        break;
      case 'Explore':
        setTitle('FYI - Explore');
        break;
      case 'Plans':
        setTitle('FYI - Plans');
        break;
      case 'About':
        setTitle('FYI - About');
        break;
      default:
        setTitle('FYI - For Your Inner Man');
    }
  }, [currentTab]);
  const navigation = useNavigation<NativeStackNavigationProp<MenuStackParamList>>();
  return (
    <View style={styles.container}>
      <Icon name="users" size={22} />
      <Text style={styles.title}>{title}</Text>
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


