import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '../../firebase-config';

export const sendFriendRequest = async (
  requesterId: string,
  receiverId: string
) => {
  await addDoc(collection(db, 'friendships'), {
    requesterId,
    receiverId,
    status: 'pending',
    createdAt: new Date(),
  });
};

export const acceptFriendRequest = async (friendshipId: string) => {
  const ref = doc(db, 'friendships', friendshipId);
  await updateDoc(ref, { status: 'accepted' });
};

export const getFriendsIds = async (userId: string): Promise<string[]> => {
  const q = query(
    collection(db, 'friendships'),
    where('status', '==', 'accepted'),
    where('requesterId', '==', userId)
  );

  const q2 = query(
    collection(db, 'friendships'),
    where('status', '==', 'accepted'),
    where('receiverId', '==', userId)
  );

  const [snap1, snap2] = await Promise.all([
    getDocs(q),
    getDocs(q2),
  ]);

  const friends = [
    ...snap1.docs.map(d => d.data().receiverId),
    ...snap2.docs.map(d => d.data().requesterId),
  ];

  return friends;
};
