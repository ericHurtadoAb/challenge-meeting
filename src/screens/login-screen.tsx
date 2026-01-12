import { Pressable, StyleSheet, Text, View } from 'react-native';
import { loginAnonymously } from '../services/auth.service';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in or sign up</Text>

      <View style={styles.phoneBox}>
        <Text style={styles.flag}>🇪🇸</Text>
        <Text style={styles.prefix}>+34</Text>
        <Text style={styles.placeholder}>Phone number</Text>
      </View>

      <Pressable style={styles.continueButton} onPress={async () => {
                                                await loginAnonymously();
                                              }}>
        <Text style={styles.continueText}>Continue</Text>
      </Pressable>

      <Text style={styles.legal}>
        By continuing, you agree to our Terms and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
  },
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  prefix: {
    color: '#fff',
    marginRight: 8,
  },
  placeholder: {
    color: '#777',
  },
  continueButton: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontWeight: '600',
  },
  legal: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});


