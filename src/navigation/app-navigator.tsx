import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../context/auth-context';
import BottomTabs from '../screens/bottom-tabs';
import LoginScreen from '../screens/login-screen';
import UserProfileScreen from '../screens/user-profile-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Tabs: undefined;
  Login: undefined;
  Profile: undefined;
  SearchFriends: undefined;
  UserProfile: { userId: string };
  SearchUsers: undefined;
  FriendsRequest: undefined;
};

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
        <Stack.Screen name="Tabs" component={BottomTabs} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
