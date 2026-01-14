import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { login, register } from "../services/auth.service";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>

        {isRegister && (
          <TextInput
            placeholder="Display Name"
            placeholderTextColor={COLORS.textSecondary}
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
          />
        )}

        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.textSecondary}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.textSecondary}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>
          )}
        </Pressable>

        <Pressable onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.toggle}>
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: SPACING.m,
  },
  box: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.l,
    padding: SPACING.l,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.m,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: COLORS.textPrimary,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    marginBottom: SPACING.s,
  },
  button: {
    backgroundColor: COLORS.accent,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: "center",
    marginTop: SPACING.m,
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
  },
  toggle: {
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
    textAlign: "center",
  },
  error: {
    color: COLORS.danger,
    marginTop: SPACING.s,
    textAlign: "center",
  },
});
