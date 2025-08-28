import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminDashboard from "../screens/Admin/AdminDashboard";
import DevotionsAdmin from "../screens/Admin/DevotionsAdmin";
import PlansAdmin from "../screens/Admin/PlansAdmin";
import ExploreAdmin from "../screens/Admin/ExploreAdmin";
import HomeStack from "./HomeStack";


const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="DevotionsAdmin" component={DevotionsAdmin} />
      <Stack.Screen name="PlansAdmin" component={PlansAdmin} />
      <Stack.Screen name="ExploreAdmin" component={ExploreAdmin} />
      <Stack.Screen name="HomeStack" component={HomeStack} />
      {/* Add other admin screens here */}
    </Stack.Navigator>
  );
}
