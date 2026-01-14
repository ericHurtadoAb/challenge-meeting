import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/app-navigator';
import FriendsScreen from '../screens/friends-screen';
import HomeScreen from '../screens/home-screen';
import FriendsRequestScreen from './friends-request-screen';
import SearchFriendsScreen from './friends-search-screen';
import ProfileScreen from './profile-screen';
import UserProfileScreen from './user-profile-screen';
import SearchUsersScreen from './user-search-screen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Perfil propio */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* Perfil de otro usuario */}
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      {/* Buscar usuarios desde perfil */}
      <Stack.Screen name="SearchUsers" component={SearchUsersScreen} />
      <Stack.Screen name="SearchFriends" component={SearchFriendsScreen} />
      <Stack.Screen name="FriendsRequest" component={FriendsRequestScreen} />
    </Stack.Navigator>
  );
}
