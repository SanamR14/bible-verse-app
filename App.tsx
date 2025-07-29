import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
      <Toast />
    </NavigationContainer>
  );
}
