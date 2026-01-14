import { db } from "@/firebase-config";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { user } from "../models/user";

export const getUserById = async (id: string) => {
  const ref = doc(db, "users", id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as user) : null;
};

export const searchUsers = async (searchTerm: string, userId: string) => {
  const q = query(
    collection(db, "users"),
    where("displayName", ">=", searchTerm),
    where("displayName", "<=", searchTerm + "\uf8ff"),
    where("id", "!=", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as user[];
};

export const createUser = async (user: user) => {
  await setDoc(doc(db, "users", user.id), user);
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<Pick<user, "displayName" | "photoURL">>
): Promise<user> => {
  try {
    const userRef = doc(db, "users", userId);

    // Actualizamos los campos en Firestore
    await updateDoc(userRef, data);

    // Obtenemos el usuario actualizado
    const updatedSnap = await getDoc(userRef);
    if (!updatedSnap.exists()) throw new Error("User not found");

    return { id: updatedSnap.id, ...updatedSnap.data() } as user;
  } catch (err) {
    console.error("Error updating user profile:", err);
    throw err;
  }
};
