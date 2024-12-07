// config/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDl6C7aG5ejQscoL0eXiJX5HVPgEuBbM7A",
  authDomain: "eventoscomunitarios-688da.firebaseapp.com",
  projectId: "eventoscomunitarios-688da",
  storageBucket: "eventoscomunitarios-688da.firebasestorage.app",
  messagingSenderId: "569468078664",
  appId: "1:569468078664:web:6be5d32d4cc2302eeb267d",
  measurementId: "G-9BKYV9T9WL"
};

let app;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };