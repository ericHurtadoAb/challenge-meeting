import React from 'react';
import { Button, Text, View } from 'react-native';
import { auth } from '../../firebase-config';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 22 }}>🔥 Reto del día</Text>

      <Button
        title="Enviar prueba"
        onPress={() => navigation.navigate('SubmitChallenge')}
      />

      <Button
        title="Perfil"
        onPress={() => navigation.navigate('Profile')}
      />

      <Button
        title="Cerrar sesión"
        onPress={() => auth.signOut()}
      />
    </View>
  );
}
