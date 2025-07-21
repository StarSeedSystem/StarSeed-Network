// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add your own Firebase configuration from your Firebase project settings
// IMPORTANT: This is a read-only demo configuration. Replace with your own.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCVK6RorG31wvVpW4AEJgBprS--5uS6sE4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dev-prototyping-355415.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dev-prototyping-355415",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dev-prototyping-355415.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "367939130765",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:367939130765:web:86e42b29213444a7f0545d"
};

// Initialize Firebase
// We need to check if the app is already initialized to avoid errors on hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
