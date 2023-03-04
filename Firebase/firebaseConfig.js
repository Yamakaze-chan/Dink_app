import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage"
import { initializeApp } from "firebase/app";
import "firebase/compat/firestore";
import { getFirestore } from 'firebase/firestore'



const firebaseConfig = {
    apiKey: "AIzaSyC7d7f_RnIoINbycw6ipkiT-tuf9cWeYyQ",
    authDomain: "food-app-bfdd2.firebaseapp.com",
    projectId: "food-app-bfdd2",
    storageBucket: "food-app-bfdd2.appspot.com",
    messagingSenderId: "965871622667",
    appId: "1:965871622667:web:88507feb07f206cb13050e",
    measurementId: "G-LB8LHR6DDS"
  };


// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = getFirestore();

export { firebase, db }