import firebase from "firebase";



const firebaseApp = firebase.initializeApp({
  // copy and paste your firebase credential here
    apiKey: "AIzaSyDpNzj_d-SdymPqkc-KBOQvj822RvvUz98",
    authDomain: "bdpapayapp.firebaseapp.com",
    databaseURL: "https://bdpapayapp.firebaseio.com",
    projectId: "bdpapayapp",
    storageBucket: "bdpapayapp.appspot.com",
    messagingSenderId: "997276933696",
    appId: "1:997276933696:web:25dfd4233f34ea103b09a5",
    measurementId: "G-KHFKH22MLM",
});


const db = firebaseApp.firestore();

export { db };