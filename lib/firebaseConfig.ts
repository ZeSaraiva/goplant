    // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCH7cbw6IwCOJ0SJQtupcERMMhSvDG5TtM",
  authDomain: "plantgoapp.firebaseapp.com",
  databaseURL: "https://plantgoapp-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "plantgoapp",
  storageBucket: "plantgoapp.firebasestorage.app",
  messagingSenderId: "649716448086",
  appId: "1:649716448086:web:be066040ce75d71b70b4f7",
  measurementId: "G-M20T3D62D9"
};

const app = initializeApp(firebaseConfig);

// 🔥 Exportar a base de dados Firestore
const db = getFirestore(app);

export { db };