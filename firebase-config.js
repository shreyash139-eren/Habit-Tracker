  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  import { getFirestore} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

  
  const firebaseConfig = {
    apiKey: "AIzaSyC56W0qI0uvjF5cNZPCPUC3x-3TftS7zMU",
    authDomain: "habithole-73a94.firebaseapp.com",
    projectId: "habithole-73a94",
    storageBucket: "habithole-73a94.firebasestorage.app",
    messagingSenderId: "1045264687235",
    appId: "1:1045264687235:web:0ee44ff049b49fb031fbb6",
    measurementId: "G-58MQ8KTKBF"
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
