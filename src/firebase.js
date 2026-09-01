import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYGg4tIwZ72iOPkYKD6Fw2PFVWRQMDjoM",
  authDomain: "trusted-op-new.firebaseapp.com",
  databaseURL: "https://trusted-op-new-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trusted-op-new",
  storageBucket: "trusted-op-new.firebasestorage.app",
  messagingSenderId: "13226718485",
  appId: "1:13226718485:web:ab8b9116bd793df268251c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase persistence error:", error);
});

export default app;
