import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faHandsPraying, faBookmark, faPeopleGroup, faPersonPraying, faLinkSlash, faQuestion, faLanguage, faShareFromSquare, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';


export default function Menu() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>User Name</Text>

        <TouchableOpacity>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View> */}

      {/* Content Box */}
      <View style={styles.contentBox}>
        <TouchableOpacity style={styles.item}>
          <FontAwesomeIcon icon={faUser} size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
         <FontAwesomeIcon icon={faBookmark} size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Saved Items</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <FontAwesomeIcon icon={faHandsPraying} size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Prayer Request</Text>
        </TouchableOpacity>

         <TouchableOpacity style={styles.item}>
          <FontAwesomeIcon icon={faPeopleGroup}  size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Fellowship</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <FontAwesomeIcon icon={faPersonPraying} size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Prayer Warrier?</Text>
        </TouchableOpacity>

         <TouchableOpacity style={styles.item}>
          <FontAwesomeIcon icon={faLinkSlash} size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Do you feel disconnected?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
           <FontAwesomeIcon icon={faPeopleGroup} size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Christ Community</Text>
        </TouchableOpacity>

         <TouchableOpacity style={styles.item}>
          <FontAwesomeIcon icon={faQuestion}  size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <FontAwesomeIcon icon={faLanguage}  size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Language</Text>
        </TouchableOpacity>

         <TouchableOpacity style={styles.item}>
          <FontAwesomeIcon icon={faShareFromSquare} size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
         <FontAwesomeIcon icon={faArrowRightFromBracket} size={20} color="#000" style={styles.icon} />
          <Text style={styles.itemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
  contentBox: {
    backgroundColor: '#fdf6ee',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
});
