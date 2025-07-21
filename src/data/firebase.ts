
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration - THIS IS CORRECT
const firebaseConfig = {
  apiKey: "AIzaSyDymU2o51_qnYPu-wug3_UnDeBYP11VY04",
  authDomain: "dev-prototyping-355415.firebaseapp.com",
  projectId: "dev-prototyping-355415",
  storageBucket: "dev-prototyping-355415.appspot.com",
  messagingSenderId: "338980186526",
  appId: "1:338980186526:web:73c88b067f9a1f5de844f2",
  measurementId: "G-1W1Y11FN7M"
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
