import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FriendsScreen from '../screens/friends-screen';
import HomeScreen from '../screens/home-screen';
import ProfileScreen from '../screens/profile-screen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0f0f0f' },
        tabBarActiveTintColor: '#6CFF8E',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
