// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBU5BthxTTjPLVCYwROBDwtBMhXUi0k53o",
  authDomain: "chat-with-pdf-8d823.firebaseapp.com",
  projectId: "chat-with-pdf-8d823",
  storageBucket: "chat-with-pdf-8d823.firebasestorage.app",
  messagingSenderId: "605398374180",
  appId: "1:605398374180:web:cfd12fce2af374612845b1",
  measurementId: "G-8S3QGD1XQ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
