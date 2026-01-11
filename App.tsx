import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './src/hooks/use-auth';
import AppNavigator from './src/navigation/app-navigator';

export default function App() {
  const user = useAuth();

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator isLoggedIn={!!user} />
    </NavigationContainer>
  );
}
