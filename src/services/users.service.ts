import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { user } from '../models/user';

export const createUserIfNotExists = async (user: user) => {
  const ref = doc(db, 'users', user.id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, user);
  }
};

export const getUserById = async (userId: string) => {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data() as user;
};
