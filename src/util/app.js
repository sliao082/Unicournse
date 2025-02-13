import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCG50XRf7mjx5hgKKCChV8t91Jp04vTnhQ",
    authDomain: "unicournse.firebaseapp.com",
    projectId: "unicournse",
    storageBucket: "unicournse.firebasestorage.app",
    messagingSenderId: "771247932394",
    appId: "1:771247932394:web:63a445aad77a79c52de893",
    measurementId: "G-E2JHZ7R2XH"
};

const app = initializeApp(firebaseConfig);

export default app;