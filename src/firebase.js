import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'
var firebaseConfig  = {
    apiKey: "AIzaSyCRi6ujJ9Oq9N8b5PfPIGm5jauUMTaZyoI",
    authDomain: "corona-hulp-app.firebaseapp.com",
    projectId: "corona-hulp-app",
    storageBucket: "corona-hulp-app.appspot.com",
    messagingSenderId: "271663517352",
    appId: "1:271663517352:web:6e52f23103846de3533c9d",
    measurementId: "G-B83L5YKL3C"
  };


  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
  export default firebase;