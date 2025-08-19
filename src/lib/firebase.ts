import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "ai-video-interviewer",
  appId: "1:599352153384:web:945760f13cac8e7676ac1d",
  storageBucket: "ai-video-interviewer.firebasestorage.app",
  apiKey: "AIzaSyAiy6RQpmR3FFKA9rPwx3lPKkDEPaRrf4g",
  authDomain: "ai-video-interviewer.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "599352153384",
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
