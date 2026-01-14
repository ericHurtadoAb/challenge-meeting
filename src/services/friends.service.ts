import { db } from "@/firebase-config";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { friendship } from "../models/friendship";
import { getUserById } from "./users.service";

// Crear solicitud de amistad
export const sendFriendRequest = async (fromId: string, toId: string) => {
  // Comprobar si ya existe amistad o solicitud
  const q = query(
    collection(db, "friendships"),
    where("user1", "in", [fromId, toId]),
    where("user2", "in", [fromId, toId])
  );
  const snap = await getDocs(q);
  if (!snap.empty) throw new Error("Friendship already exists");

  const ref = await addDoc(collection(db, "friendships"), {
    user1: fromId,
    user2: toId,
    status: "pending",
    actionBy: fromId,
    createdAt: new Date(),
  });

  return ref.id;
};

// Aceptar solicitud de amistad
export const acceptFriendRequest = async (friendshipId: string) => {
  const ref = doc(db, "friendships", friendshipId);
  await updateDoc(ref, { status: "accepted" });
};

// Rechazar solicitud
export const rejectFriendRequest = async (friendshipId: string) => {
  const ref = doc(db, "friendships", friendshipId);
  await deleteDoc(ref);
};

// Obtener todos los amigos de un usuario
export const getFriends = async (userId: string) => {
  const q = query(
    collection(db, "friendships"),
    where("status", "==", "accepted")
  );
  const snap = await getDocs(q);

  const friendIds: string[] = snap.docs
    .map((docSnap) => {
      const data = docSnap.data() as friendship;
      return data.user1 === userId ? data.user2 : data.user1;
    })
    .filter((id) => id !== userId);

  const friends = await Promise.all(friendIds.map((id) => getUserById(id)));

  return friends;
};

// Obtener solicitudes entrantes pendientes
export const getPendingRequests = async (userId: string) => {
  const q = query(
    collection(db, "friendships"),
    where("user2", "==", userId),
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  const friendships = snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  })) as friendship[];
  const users = await Promise.all(
    friendships.map((f) => getUserById(f.user1))
  );

  return users;
};

// Obtener el estado de amistad con otro usuario
export const getFriendshipStatus = async (currentUserId: string, otherUserId: string) => {
  const q = query(
    collection(db, "friendships"),
    where("user1", "in", [currentUserId, otherUserId]),
    where("user2", "in", [currentUserId, otherUserId])
  );
  const snap = await getDocs(q);
  if (snap.empty) return "none";

  const data = snap.docs[0].data();
  if (data.status === "accepted") return "friends";
  if (data.status === "pending") return data.actionBy === currentUserId ? "sent" : "pending";
  return "none";
};

export const getFriendshipId = async (currentUserId: string, otherUserId: string) => {
  const q = query(
    collection(db, "friendships"),
    where("user1", "in", [currentUserId, otherUserId]),
    where("user2", "in", [currentUserId, otherUserId])
  );
  const snap = await getDocs(q);
  if (snap.empty) return "none";

  const data = snap.docs[0];
  return data.id;
};
