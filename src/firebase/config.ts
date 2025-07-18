// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAocUaoPWOFKL3c7k9JQe2GlvJUPV3YgOc",
  authDomain: "assist-database.firebaseapp.com",
  projectId: "assist-database",
  storageBucket: "assist-database.firebasestorage.app",
  messagingSenderId: "446540596017",
  appId: "1:446540596017:web:ca5904dd96cccb6234e610",
  measurementId: "G-MMBV6FY2WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, analytics };
export default app;