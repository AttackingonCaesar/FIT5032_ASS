import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDcp6TbGebDh5ZJO5eBd6i5HC5BM-TN_U8",
    authDomain: "week7-yijiang.firebaseapp.com",
    projectId: "week7-yijiang",
    storageBucket: "week7-yijiang.appspot.com",
    messagingSenderId: "591139799118",
    appId: "1:591139799118:web:29c4230b56affbe72ac31f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
