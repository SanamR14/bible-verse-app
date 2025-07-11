// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';

// interface Props {
//   state: any;
//   descriptors: any;
//   navigation: any;
// }

// const BottomNav: React.FC<Props> = ({ state, descriptors, navigation }) => {
//   return (
//     <View style={styles.container}>
//       {state.routes.map((route: any, index: number) => {
//         const { options } = descriptors[route.key];
//         const label = options.tabBarLabel ?? route.name;
//         const icon = getIconForRoute(route.name);
//         const isFocused = state.index === index;

//         const onPress = () => {
//           if (!isFocused) {
//             navigation.navigate(route.name);
//           }
//         };

//         return (
//           <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
//             <Icon name={icon} size={22} color={isFocused ? '#c89720' : '#000'} />
//             <Text style={[styles.label, isFocused && styles.activeLabel]}>{label}</Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// const getIconForRoute = (routeName: string) => {
//   switch (routeName) {
//     case 'Home': return 'home';
//     case 'Devotions': return 'book';
//     case 'Plans': return 'info';
//     default: return 'circle';
//   }
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderColor: '#eee',
//     padding: 8,
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//   },
//   tab: {
//     alignItems: 'center',
//   },
//   label: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   activeLabel: {
//     color: '#c89720',
//     fontWeight: 'bold',
//   },
// });

// export default BottomNav;
