// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-O7lKAlzac4nW51UybT0IEeNThiZmcNk",
    authDomain: "apexstreamstats.firebaseapp.com",
    projectId: "apexstreamstats",
    storageBucket: "apexstreamstats.appspot.com",
    messagingSenderId: "540694936718",
    appId: "1:540694936718:web:c4808606c8a45ec9059ddf",
    measurementId: "G-MT36KVLT4E"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth();