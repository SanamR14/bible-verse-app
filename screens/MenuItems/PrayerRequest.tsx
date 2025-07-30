import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { Switch } from 'react-native';
import { Button } from 'react-native';


export default function PrayerRequest() {

  const navigation = useNavigation();
  const [value, onChangeText] = React.useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prayer Request</Text>
        <TouchableOpacity>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.body}>Please enter your prayer requests here and save. Your prayer request list can be accessed by clicking on the top right icon. Also, the requests will be sent to our prayer warrior team.</Text>
       <TextInput
          editable
          multiline
          numberOfLines={10}
          maxLength={100}
          onChangeText={text => onChangeText(text)}
          value={value}
          style={styles.textInput}
        />
      <Text style={styles.body}>A small prayer comes here</Text>
      <View style={styles.privateRow}>
        <Text style={styles.label}>Anonymous Prayer Request</Text>
            <Switch style={styles.btn} value={isPrivate} onValueChange={setIsPrivate} />
      </View>
      <Button title="Save" />
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
  body: {
    margin:10,
  },
  textInput: {
    padding: 5,
    margin: 10,
  },
  label: { fontSize: 16, marginBottom: 25 },
  privateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btn: { marginTop: -23}
});


