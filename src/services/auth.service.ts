import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const register = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export async function loginAnonymously() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in anonymously:', error);
    throw error;
  }
}
