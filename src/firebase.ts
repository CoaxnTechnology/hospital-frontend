import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVM5_pOmn2tU0DsZmsNtrmL6MgGPPaeNs",
  authDomain: "prime-care-app.firebaseapp.com",
  projectId: "prime-care-app",
  storageBucket: "prime-care-app.firebasestorage.app",
  messagingSenderId: "142684222004",
  appId: "1:142684222004:web:a84ff5616dfd6f7ab5061",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };
