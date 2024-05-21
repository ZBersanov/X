// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "x-next-v1.firebaseapp.com",
  projectId: "x-next-v1",
  storageBucket: "x-next-v1.appspot.com",
  messagingSenderId: "829925251537",
  appId: "1:829925251537:web:cb76ad98d9d666d22228f0",
  measurementId: "G-8C2JCTF4RL",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
