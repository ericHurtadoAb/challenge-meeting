import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '../../firebase-config';
import { user } from '../models/user';
import { createUserIfNotExists } from '../services/users.service';

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const userModel: user = {
          id: firebaseUser.uid,
          displayName: 'Anonymous',
          photoURL: firebaseUser.photoURL,
          createdAt: new Date(),

          streak: 0,
          totalCompleted: 0,
          totalFailed: 0,

          isAnonymous: firebaseUser.isAnonymous,
          friendsCount: 0,
        };

        await createUserIfNotExists(userModel);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
