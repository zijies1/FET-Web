import {
  LOGIN,
  LOGOUT,
  REGISTER
} from '../constants/actionTypes';
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDcWtQqtqJeQ0QvxGEXtIRyiyoc42lWmmc",
  authDomain: "fet-web.firebaseapp.com",
  databaseURL: "fet-web.firebaseio.com",
  projectId: "fet-web",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID"
};

firebase.initializeApp(config);

export function onLogin(user) {
  return {
    type: LOGIN,
    payload:firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  };
}

export function onRegister(user) {
  return {
    type: REGISTER,
    payload:firebase.auth().createUserWithEmailAndPassword(user.email, user.password),
    user
  };
}

export function logout() {
  return {
    type: LOGOUT,
    payload:firebase.auth().signOut()
  };
}
