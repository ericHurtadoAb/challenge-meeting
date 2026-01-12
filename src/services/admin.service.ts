import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

export const createTodayChallengeIfNotExists = async () => {
  const todayId = new Date().toISOString().split('T')[0];

  await setDoc(
    doc(db, 'dailyChallenges', todayId),
    {
      title: 'Build a Creative Tower',
      description: 'Construye una torre con lo que tengas a mano',
      startsAt: new Date(),
      endsAt: new Date(
        new Date().setHours(23, 59, 59, 999)
      ),
      isActive: true,
    },
    { merge: true }
  );
};
