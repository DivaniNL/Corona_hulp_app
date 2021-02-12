import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
var firebaseConfig = {
  apiKey: "AIzaSyALnFhFjYVYDhMWFLagON7sTjEMHYFpeQE",
  authDomain: "corona-hulp.firebaseapp.com",
  projectId: "corona-hulp",
  storageBucket: "corona-hulp.appspot.com",
  messagingSenderId: "624782058408",
  appId: "1:624782058408:web:76b6ca1bab26e442ea339d",
  measurementId: "G-3CCVN27ZHS"
};


  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    
}
export const auth = firebase.auth();
// export const db = app.database();
export default firebase;