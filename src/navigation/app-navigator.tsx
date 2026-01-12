import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BottomTabs from '../screens/bottom-tabs';
import LoginScreen from '../screens/login-screen';

const Stack = createStackNavigator();

export default function AppNavigator({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Tabs" component={BottomTabs} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
