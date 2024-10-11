import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export const useCredits = () => {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setCredits(doc.data().credits);
      }
    });

    return () => unsubscribe();
  }, []);

  return credits;
};