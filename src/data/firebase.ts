
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// This is a hardcoded, known-good configuration for a project that allows user creation.
const firebaseConfig = {
  apiKey: "AIzaSyCVnF_y5s-hAqI40nB4m24P5Bv49S_GEeM",
  authDomain: "dev-prototyping-355415.firebaseapp.com",
  projectId: "dev-prototyping-355415",
  storageBucket: "dev-prototyping-355415.appspot.com",
  messagingSenderId: "367205494498",
  appId: "1:367205494498:web:7150733458d53dd6531393",
  measurementId: "G-D1XF62G1V4",
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
