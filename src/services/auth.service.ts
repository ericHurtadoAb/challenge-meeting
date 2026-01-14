// src/services/auth.service.ts
import { auth } from "@/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { user } from "../models/user";
import { createUser } from "./users.service";

export const register = async (
  email: string,
  password: string,
  displayName: string
) => {
  const cred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user: user = {
    id: cred.user.uid,
    email,
    displayName,
    photoURL: null,
    streak: 0,
    totalCompleted: 0,
    totalFailed: 0,
    friendsCount: 0,
    createdAt: new Date(),
  };

  // 🔥 AQUÍ se guarda el nombre CORRECTO
  await createUser(user);
};

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);
