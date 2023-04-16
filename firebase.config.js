// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEaOGPrYjbM0ko9Ch208YA4lAbFJCqwew",
  authDomain: "notes-3f0e5.firebaseapp.com",
  projectId: "notes-3f0e5",
  storageBucket: "notes-3f0e5.appspot.com",
  messagingSenderId: "743950442941",
  appId: "1:743950442941:web:0c59b0874b641417ab72d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = app.auth();

export const dataBase = getDatabase(app);