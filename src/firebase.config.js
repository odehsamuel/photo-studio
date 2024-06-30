import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQncoKlOU6vxocqxiEiKxdszyYY6SR4eA",
  authDomain: "photo-studio-ff74a.firebaseapp.com",
  projectId: "photo-studio-ff74a",
  storageBucket: "photo-studio-ff74a.appspot.com",
  messagingSenderId: "700181421743",
  appId: "1:700181421743:web:446e07ae6cd67013cc3e5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()