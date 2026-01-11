import React, { useState } from 'react';
import { Text, View } from 'react-native';
import AppButton from '../components/app-button';
import AppInput from '../components/app-input';
import { loginAnonymously, register } from '../services/auth.service';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 22 }}>Login</Text>

      <AppInput placeholder="Email" value={email} onChangeText={setEmail} />
      <AppInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <AppButton title="Entrar" onPress={() => loginAnonymously()} />
      <AppButton title="Registrarse" onPress={() => register(email, password)} />
    </View>
  );
}
