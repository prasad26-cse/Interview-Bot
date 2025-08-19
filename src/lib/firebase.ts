import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
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

// Wrapping auth initialization in a check for window resolves the 403 error
// by preventing the SDK from trying to connect to a backend it doesn't have
// permissions for in this environment.
const auth = typeof window !== 'undefined' 
  ? initializeAuth(app, { persistence: indexedDBLocalPersistence })
  : getAuth(app);
  
const db = getFirestore(app);

export { app, auth, db };
