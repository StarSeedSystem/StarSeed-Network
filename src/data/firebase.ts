// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDymU2o51_qnYPu-wug3_UnDeBYP11VY04",
  authDomain: "starseed-nexus.firebaseapp.com",
  projectId: "starseed-nexus",
  storageBucket: "starseed-nexus.appspot.com",
  messagingSenderId: "991289184832",
  appId: "1:991289184832:web:862cd77bd0b9f60aea85a5"
};


// --- CORRECT INITIALIZATION LOGIC ---
// This robust logic prevents re-initializing the app on hot reloads in development
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
