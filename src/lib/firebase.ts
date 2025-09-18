// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-2777926424-9180e",
  "appId": "1:357027570341:web:2e3525103a89735f53634c",
  "storageBucket": "studio-2777926424-9180e.appspot.com",
  "apiKey": "AIzaSyA972aE5Y8_KWR9CThyeSQBZimepxOtLWQ",
  "authDomain": "studio-2777926424-9180e.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "357027570341"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
