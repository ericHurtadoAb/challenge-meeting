import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import {
    getReactNativePersistence,
    initializeAuth
} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKLTn6uHlkcl_AtmEC5TG1vFsO9ZcyjAk",
  authDomain: "challenge-meeting-68e25.firebaseapp.com",
  projectId: "challenge-meeting-68e25",
  storageBucket: "challenge-meeting-68e25.firebasestorage.app",
  messagingSenderId: "634222116462",
  appId: "1:634222116462:web:15e46d52585f66bbe9707f",
  measurementId: "G-Z23PK3XK2G"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
