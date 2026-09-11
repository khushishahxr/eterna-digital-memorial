import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCwg_DxPKwwPs9snrlnSfbr4jBHAOYAwwY",
  authDomain: "eterna-a07a4.firebaseapp.com",
  projectId: "eterna-a07a4",
  storageBucket: "eterna-a07a4.appspot.com",
  messagingSenderId: "632719129451",
  appId: "1:632719129451:web:3996ce0eca8601d2d2ea2e",
  measurementId: "G-3KDHJ2XL82"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
