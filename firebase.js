import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSzJmoocSe-48-OBmy-OrBMm1v5SqyCCs",
  authDomain: "church-directory-86ccb.firebaseapp.com",
  projectId: "church-directory-86ccb",
  storageBucket: "church-directory-86ccb.firebasestorage.app",
  messagingSenderId: "836390060293",
  appId: "1:836390060293:web:b9d1b4dd057748cfe0376c"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

window.firebase = { auth, db };

console.log("Firebase initialized:", window.firebase);
