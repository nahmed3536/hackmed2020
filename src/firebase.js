import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyBCXvhNe2yi7OMrkK8hd4fvNmkdPzsICiA",
    authDomain: "hackmed-701be.firebaseapp.com",
    databaseURL: "https://hackmed-701be.firebaseio.com",
    projectId: "hackmed-701be",
    storageBucket: "hackmed-701be.appspot.com",
    messagingSenderId: "1074805394532",
    appId: "1:1074805394532:web:0d74647531f6a9798a2371",
    measurementId: "G-TLQ33VCGHP",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
