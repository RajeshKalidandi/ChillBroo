import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // Add user to Firestore with initial 100 credits
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        credits: 100,
        createdAt: new Date(),
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error (show message to user)
    }
  };

  return (
    // ... (rest of the component remains the same)
  );
};

export default Register;