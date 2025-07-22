
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration - THIS IS A PUBLIC, READ-ONLY DEMO PROJECT
const firebaseConfig = {
  apiKey: "AIzaSyCV_TTa_3YmB7J_89g_u4P8V_jA4aTjZ-c",
  authDomain: "dev-prototyper-tools.firebaseapp.com",
  projectId: "dev-prototyper-tools",
  storageBucket: "dev-prototyper-tools.appspot.com",
  messagingSenderId: "983277328114",
  appId: "1:983277328114:web:80447387a3c3182b13c77c"
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
