"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhK6vBXkH-cyrVuajVEWoyEs2INBeNuWU",
  authDomain: "project-28cba.firebaseapp.com",
  projectId: "project-28cba",
  storageBucket: "project-28cba.appspot.com",
  messagingSenderId: "868591400130",
  appId: "1:868591400130:web:ddebc24dc876201b3bb75b",
  measurementId: "G-S3FQ9QTQV1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

// Export Firestore and Analytics
export { db, analytics, storage };
