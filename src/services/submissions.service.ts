import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { submission } from '../models/submission';

export const createSubmission = async (
  submission: Omit<submission, 'id'>
) => {
  await addDoc(collection(db, 'submissions'), submission);
  return submission as submission;
};

export const getSubmissionByUserAndChallenge = async (
  userId: string,
  challengeId: string
) => {
  const q = query(
    collection(db, 'submissions'),
    where('userId', '==', userId),
    where('challengeId', '==', challengeId)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as submission;
};

export const getSubmissionsByChallenge = async (
  userId: string,
  challengeId: string
) => {
  const q = query(
    collection(db, 'submissions'),
    where('userId', '!=', userId),
    where('challengeId', '==', challengeId)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const docSnaps = snap.docs;
  return docSnaps.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as submission[];
};
