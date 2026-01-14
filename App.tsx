import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/auth-context';
import AppNavigator from './src/navigation/app-navigator';
import { createTodayChallengeIfNotExists } from './src/services/admin.service';

export default function App() {
  useEffect(() => {
    createTodayChallengeIfNotExists();
  }, []);


  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator/>
      </NavigationContainer>
    </AuthProvider>
  );
}
