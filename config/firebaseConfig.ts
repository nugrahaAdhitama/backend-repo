import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBV6SXLiAkECekd-idgmJrx-enMLD24Gl8",
  authDomain: "ebuddy-pte-ltd-technical-test.firebaseapp.com",
  projectId: "ebuddy-pte-ltd-technical-test",
  storageBucket: "ebuddy-pte-ltd-technical-test.appspot.com",
  messagingSenderId: "913533948076",
  appId: "1:913533948076:web:9bfedc2aed17d1a7788f09",
  measurementId: "G-YYKC7YKYSW",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
