// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANW6YGzEn4kewp61lrwzFpb6K3Dnr4-yQ",
  authDomain: "smartpharma-45bb5.firebaseapp.com",
  projectId: "smartpharma-45bb5",
  storageBucket: "smartpharma-45bb5.firebasestorage.app",
  messagingSenderId: "598235965299",
  appId: "1:598235965299:web:26981968708df66d4a4706"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);      // <-- must be declared here
const db = getFirestore(app);
const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

export { auth, db, storage };