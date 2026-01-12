import { Image, StyleSheet, Text, View } from 'react-native';
import { submission } from '../models/submission';
import { COLORS, RADIUS, SPACING } from '../styles/theme';

export default function ChallengeCard(submission: submission) {
  return (
    <View style={styles.card}>
      <Text style={styles.user}>{submission.userName}</Text>

      <Image source={{ uri: submission.mediaUrl }} style={styles.image} />

      <View style={styles.votes}>
        <View style={styles.likeButton}>
          <Text>✔️​ {submission.votesUp}</Text>
        </View>
        <View style={styles.dislikeButton}>
          <Text>✖️​​ {submission.votesDown}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    margin: SPACING.m,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
  },
  user: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.s,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: RADIUS.m,
  },
  votes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.s,
  },
  likeButton: {
    backgroundColor: COLORS.accent,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  dislikeButton: {
    backgroundColor: COLORS.danger,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  up: {
    color: COLORS.accent,
  },
  down: {
    color: COLORS.danger,
  },
});

