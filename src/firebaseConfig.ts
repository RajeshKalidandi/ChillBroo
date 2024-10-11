import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug: Log the environment variables (without revealing sensitive information)
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Not Set',
  authDomain: firebaseConfig.authDomain ? 'Set' : 'Not Set',
  projectId: firebaseConfig.projectId ? 'Set' : 'Not Set',
  storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Not Set',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Not Set',
  appId: firebaseConfig.appId ? 'Set' : 'Not Set',
  measurementId: firebaseConfig.measurementId ? 'Set' : 'Not Set'
});

// Check if all required configuration values are present
const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error(`Missing Firebase configuration values: ${missingKeys.join(', ')}`);
  throw new Error('Firebase configuration is incomplete. Check your environment variables.');
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };