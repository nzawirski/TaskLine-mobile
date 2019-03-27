import Firebase from '@firebase/app';
 let config = {
  apiKey: "AIzaSyCCg8GZ67b5q-eAZAFrDbWVAxg-cnjae7k",
  authDomain: "taskline-235718.firebaseapp.com",
  databaseURL: "https://taskline-235718.firebaseio.com",
  projectId: "taskline-235718",
  storageBucket: "taskline-235718.appspot.com",
  messagingSenderId: "461042728911"
};
let app = Firebase.initializeApp(config);
export const db = app.database();
