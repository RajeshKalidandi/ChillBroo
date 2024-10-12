import * as admin from 'firebase-admin';
import * as path from 'path';
import { ServiceAccount } from 'firebase-admin';

const serviceAccountPath = path.join(__dirname, '..', 'chillbroo-firebase-adminsdk-nbrgy-30b02636de.json');

let serviceAccount: any;

try {
  serviceAccount = require(serviceAccountPath);
  console.log('Service account file loaded successfully');
} catch (error) {
  console.error('Error loading service account file:', error);
  throw new Error('Failed to load service account file');
}

if (!serviceAccount || typeof serviceAccount !== 'object') {
  throw new Error('Invalid service account file format');
}

if (!serviceAccount.project_id) {
  console.error('Service account contents:', JSON.stringify(serviceAccount, null, 2));
  throw new Error('Service account file is missing the project_id field');
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw new Error('Failed to initialize Firebase Admin SDK');
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
