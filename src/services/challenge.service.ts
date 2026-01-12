import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { dailyChallenge } from '../models/daily-challenge';

export const getTodayChallenge = async () => {
  const todayId = new Date().toISOString().split('T')[0];
  const ref = doc(db, 'dailyChallenges', todayId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as dailyChallenge;
};
