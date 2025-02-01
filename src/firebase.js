// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCG50XRf7mjx5hgKKCChV8t91Jp04vTnhQ",
    authDomain: "unicournse.firebaseapp.com",
    projectId: "unicournse",
    storageBucket: "unicournse.firebasestorage.app",
    messagingSenderId: "771247932394",
    appId: "1:771247932394:web:63a445aad77a79c52de893",
    measurementId: "G-E2JHZ7R2XH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;