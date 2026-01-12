import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../styles/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Pedro</Text>
      <Text style={styles.streak}>🔥 Streak: 5 Days</Text>

      <View style={styles.stats}>
        <Text>✔ Completed: 27</Text>
        <Text>✖ Failed: 3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '700',
  },
  streak: {
    color: COLORS.accent,
    marginVertical: SPACING.s,
    fontSize: 16,
  },
  stats: {
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    marginTop: SPACING.m,
  },
});

