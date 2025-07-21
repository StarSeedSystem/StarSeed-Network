// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// A functional, read-only demo configuration to ensure connectivity.
const firebaseConfig = {
  apiKey: "AIzaSyCVK6RorG31wvVpW4AEJgBprS--5uS6sE4",
  authDomain: "dev-prototyping-355415.firebaseapp.com",
  projectId: "dev-prototyping-355415",
  storageBucket: "dev-prototyping-355415.appspot.com",
  messagingSenderId: "367939130765",
  appId: "1:367939130765:web:86e42b29213444a7f0545d"
};

// Initialize Firebase
// We need to check if the app is already initialized to avoid errors on hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
