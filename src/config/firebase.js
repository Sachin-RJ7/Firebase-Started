import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCK6GJuKPrvYGAE6o_4WikkHEZ-lo46YrI",
  authDomain: "fir-course-e19e0.firebaseapp.com",
  projectId: "fir-course-e19e0",
  storageBucket: "fir-course-e19e0.appspot.com",
  messagingSenderId: "137504787809",
  appId: "1:137504787809:web:7080cb69ddb3025d2c8920",
  measurementId: "G-H25S2WQY6S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();