
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

import { 
  getAuth 
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import { 
  getFirestore 
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

// Konfigurasi Firebase HIMAPTIKA
const firebaseConfig = {
  apiKey: "AIzaSyA0EErv_JwYAQKmhi0xaCbqjeKG1XpmF-o",
  authDomain: "himaptika-project.firebaseapp.com",
  projectId: "himaptika-project",
  storageBucket: "himaptika-project.firebasestorage.app",
  messagingSenderId: "250569211345",
  appId: "1:250569211345:web:e2270e29562d597ff8b4f0"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan
const auth = getAuth(app);
const db = getFirestore(app);

// Ekspor agar bisa digunakan halaman lain
export { app, auth, db };
