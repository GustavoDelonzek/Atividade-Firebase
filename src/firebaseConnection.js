// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDACpBtSWT2h4b9YDlvuvXJNcMuX9DMc_Y",
    authDomain: "tarefas-78b17.firebaseapp.com",
    projectId: "tarefas-78b17",
    storageBucket: "tarefas-78b17.appspot.com",
    messagingSenderId: "526109147105",
    appId: "1:526109147105:web:f483509688e8efa93c9ca0"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)


export {db, auth};