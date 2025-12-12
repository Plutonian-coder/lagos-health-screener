import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "MOCK_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lagos-health.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lagos-health",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lagos-health.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
