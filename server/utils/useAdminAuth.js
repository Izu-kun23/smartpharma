import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const useAdminAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'admins', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          const fullName = docSnap.exists() ? docSnap.data().fullName : '';
          setAdmin({ ...firebaseUser, fullName });
        } catch (err) {
          console.error('Error loading admin:', err);
          setAdmin(firebaseUser);
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { admin, loading };
};

export default useAdminAuth;