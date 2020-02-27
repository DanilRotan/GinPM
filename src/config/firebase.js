import "firebase/auth";
import "firebase/database";

import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBJLKMQi_KdFC3YPEYqLpfK7p7PZlfpxXU",
  authDomain: "my-telegram-ccc59.firebaseapp.com",
  databaseURL: "https://my-telegram-ccc59.firebaseio.com",
  projectId: "my-telegram-ccc59",
  storageBucket: "my-telegram-ccc59.appspot.com",
  messagingSenderId: "353590283598",
  appId: "1:353590283598:web:9d461377b5c93eb22d221f"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();
export default firebase;
