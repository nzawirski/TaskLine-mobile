import Firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'
import '@firebase/firestore'

 let config = {
  apiKey: "AIzaSyCCg8GZ67b5q-eAZAFrDbWVAxg-cnjae7k",
  authDomain: "taskline-235718.firebaseapp.com",
  databaseURL: "https://taskline-235718.firebaseio.com",
  projectId: "taskline-235718",
  storageBucket: "taskline-235718.appspot.com",
  messagingSenderId: "461042728911",
};

let app = Firebase.initializeApp(config);

export const auth = app.auth();
export const db = app.database();
export const firestore = app.firestore();
