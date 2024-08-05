// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDIWWAUOpjqwnHATP2_CXZurKfVPjMFyKQ",
    authDomain: "inventory-management-3a4c2.firebaseapp.com",
    projectId: "inventory-management-3a4c2",
    storageBucket: "inventory-management-3a4c2.appspot.com",
    messagingSenderId: "761576269319",
    appId: "1:761576269319:web:ec97dbc387236ded806ca2",
    measurementId: "G-H6T4GPEDMX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore=getFirestore(app)

export {firestore};