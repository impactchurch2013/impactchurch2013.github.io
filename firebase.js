import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCSzJmoocSe-48-OBmy-OrBMm1v5SqyCCs",
  authDomain: "church-directory-86ccb.firebaseapp.com",
  projectId: "church-directory-86ccb",
  storageBucket: "church-directory-86ccb.firebasestorage.app",
  messagingSenderId: "836390060293",
  appId: "1:836390060293:web:b9d1b4dd057748cfe0376c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Persistence must settle before sign-in; index.html awaits authReady.
const authReady = setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase Auth persistence set to Local.");
  })
  .catch((error) => {
    console.error("Error setting Firebase Auth persistence:", error);
  });

window.firebase = { app, auth, db, authReady };
