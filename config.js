import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyAVA5khH4RJ0TeIs64AopLM1UIDo8W4OOk",
  authDomain: "chisendposproduction007.firebaseapp.com",
  databaseURL: "https://chisendposproduction007-default-rtdb.firebaseio.com",
  projectId: "chisendposproduction007",
  storageBucket: "chisendposproduction007.firebasestorage.app",
  messagingSenderId: "625247050110",
  appId: "1:625247050110:web:74edf0a3dc0ff792437b2f",
  measurementId: "G-J3P55BSWKP"
};
const app = initializeApp(firebaseConfig);

// Initialize Firebase services using the modular SDK
const db = getDatabase(app);

// Initialize Firebase Auth with React Native persistence
const auth = getAuth(app);

export { db, auth };


