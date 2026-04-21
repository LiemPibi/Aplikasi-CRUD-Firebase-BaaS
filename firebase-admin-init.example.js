// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbU-x2hS4Wc8AvpDG9yhy2RR8gfSJc5o0",
  authDomain: "product-manager-bdc83.firebaseapp.com",
  databaseURL: "https://product-manager-bdc83-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "product-manager-bdc83",
  storageBucket: "product-manager-bdc83.firebasestorage.app",
  messagingSenderId: "519624740177",
  appId: "1:519624740177:web:ed90d4b073b8d7dd7b5770",
  measurementId: "G-ETY4DNERT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://product-manager-bdc83-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = admin;
