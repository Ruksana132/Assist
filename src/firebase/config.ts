// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8qdOBVbieqR-hJQblHyDi1uvcx-9w1bQ",
  authDomain: "assist-facff.firebaseapp.com",
  projectId: "assist-facff",
  storageBucket: "assist-facff.firebasestorage.app",
  messagingSenderId: "612722904840",
  appId: "1:612722904840:web:f5c881417e3cbd6e5ba6bd",
  measurementId: "G-LP1C4LD4H5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, analytics };
export default app;