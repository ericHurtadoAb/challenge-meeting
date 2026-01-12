import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ChallengeCard from '../components/challenge-card';
import { COLORS, RADIUS, SPACING } from '../styles/theme';

import { getTodayChallenge } from '../services/challenge.service';
import {
  getSubmissionByUserAndChallenge,
} from '../services/submissions.service';

import { useAuth } from '../hooks/use-auth';
import { useCameraPermission } from "../hooks/use-camara-permission";
import { dailyChallenge } from '../models/daily-challenge';
import { submission } from '../models/submission';
import { submitChallengeCloudinary } from '../services/cloudinary.service';
import { getUserById } from "../services/users.service";

export default function HomeScreen() {
  const { user } = useAuth();
  const { granted, requestPermission } = useCameraPermission();

  const [challenge, setChallenge] = useState<dailyChallenge | null>(null);
  const [submission, setSubmission] = useState<submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);

      const todayChallenge = await getTodayChallenge();
      setChallenge(todayChallenge);

      if (todayChallenge) {
        const userSubmission =
          await getSubmissionByUserAndChallenge(
            user.uid,
            todayChallenge.id
          );

        setSubmission(userSubmission);
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

  const handleUpload = async () => {
    if (!user || !challenge) return;

    if (!granted) {
      const allowed = await requestPermission();
      if (!allowed) return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.2,
      videoMaxDuration: 5,
    });

    if (result.canceled) return;

    const fileUri = result.assets[0].uri;
    const type = result.assets[0].type === "video" ? "video" : "image";

    const userDetails = await getUserById(user.uid);

    const newSubmission = await submitChallengeCloudinary(fileUri, type, userDetails, challenge.id);

    if (newSubmission) setSubmission(newSubmission);
};

  if (loading || !challenge) {
    return <View style={styles.container} />;
  }

  const hasSubmitted = !!submission;

  return (
    <View
      style={[
        styles.container,
        !hasSubmitted && styles.centeredContainer,
      ]}
    >
      <Text style={styles.title}>{challenge.title}</Text>

      {hasSubmitted && submission && (
        <ChallengeCard
          {...submission}
        />
      )}

      {!hasSubmitted ? (
        <Pressable
        style={styles.uploadButton}
        onPress={handleUpload}
      >
        <Text style={styles.uploadText}>
          Upload Your Proof
        </Text>
      </Pressable>) : (
        <Text style={styles.challengeSubmited}>challenge submited!</Text>
      )}
      

      <Text style={styles.countdown}>
        19:55:10 left
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
  },

  centeredContainer: {
    justifyContent: 'center',
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: SPACING.xxl,
  },

  challengeSubmited: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: SPACING.m,
  },

  timer: {
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },

  image: {
    width: '100%',
    height: 320,
    borderRadius: RADIUS.l,
    marginVertical: SPACING.m,
  },

  uploadButton: {
    backgroundColor: COLORS.accent,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    marginTop: SPACING.m,
  },

  uploadText: {
    color: '#000',
    fontWeight: '700',
  },

  countdown: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
});
