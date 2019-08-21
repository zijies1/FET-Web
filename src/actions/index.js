import {
  LOGIN,
  LOGOUT,
  REGISTER,
  AUTH_UPDATE_FIELD,
  ASYNC_UPDATE_FIELD,
  LIST_TIMETABLE_UPDATE_FIELD,
  TIMETABLE_UPDATE_FIELD,
  PERIODS_UPDATE_FIELD,
  SUBJECTS_UPDATE_FIELD,
  TEACHERS_UPDATE_FIELD,
  YEARS_UPDATE_FIELD,
  TAGS_UPDATE_FIELD,
  ACTIVITIES_UPDATE_FIELD,
  BUILDINGS_UPDATE_FIELD,
  ROOMS_UPDATE_FIELD,
  ASYNC_START,
  ASYNC_END,
  ISLOGGEDIN,
  SAVE_TIMETABLE,
  SEND_TIMETABLE,
  NEW_TIMETABLE,
  LIST_TIMETABLES,
  GENERATE_NEW_KEY
} from '../constants/actionTypes';
import * as firebase from 'firebase';

const root = "http://127.0.0.1:5000/";

const firebaseConfig = {
  apiKey: "AIzaSyDcWtQqtqJeQ0QvxGEXtIRyiyoc42lWmmc",
  authDomain: "fet-web.firebaseapp.com",
  databaseURL: "https://fet-web.firebaseio.com",
  projectId: "fet-web",
  storageBucket: "fet-web.appspot.com",
  messagingSenderId: "594488385508",
  appId: "1:594488385508:web:0681f5d828166939"
};

firebase.initializeApp(firebaseConfig);

export function isLoggedIn() {
  return {
    type: ISLOGGEDIN,
    payload: {
      auth: firebase.auth(),
      database: firebase.database()
    }
  };
}

export function onSendTimetable(timetable) {
  return {
     type: SEND_TIMETABLE,
     payload: fetch(root + "api/v1/test", {
         method: 'POST', // *GET, POST, PUT, DELETE, etc.
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(timetable) // body data type must match "Content-Type" header
     })
   }
}

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
  };
}

export function logout() {
  return {
    type: LOGOUT,
    payload:firebase.auth().signOut()
  };
}

export function generatenNewKey() {
  return {
    type: GENERATE_NEW_KEY,
    payload:firebase.database().ref().child('timetables').push().key
  };
}

export function onNewTimetable() {
  return {
    type: NEW_TIMETABLE,
    payload:firebase.database().ref().child('timetables').push().key
  };
}

export function onSaveTimetable(timetable) {
  let uid = firebase.auth().currentUser.uid;
  var updates = {};
  timetable['lastModifiedTime'] = new Date().toLocaleString();
  updates['/timetables/' + timetable.key] = timetable;
  updates['users/' + uid + '/timetables/' + timetable.key] = timetable;
  return {
    type: SAVE_TIMETABLE,
    auth: firebase.auth(),
    database: firebase.database(),
    updates
  };
}

export function onListTimetables() {
  let uid = firebase.auth().currentUser.uid;
  return {
    type: LIST_TIMETABLES,
    payload: firebase.database().ref('/users/' + uid + '/timetables').once('value')
  };
}


export function updateFieldAuth(key, value) {
  return {
    type: AUTH_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldAsync(key, value) {
  return {
    type: ASYNC_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldTimetable(key, value) {
  return {
    type: TIMETABLE_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldListTimetable(key, value) {
  return {
    type: LIST_TIMETABLE_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldPeriods(key, value) {
  return {
    type: PERIODS_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldSubjects(key, value) {
  return {
    type: SUBJECTS_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldTeachers(key, value) {
  return {
    type: TEACHERS_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldYears(key, value) {
  return {
    type: YEARS_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldTags(key, value) {
  return {
    type: TAGS_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldActivities(key, value) {
  return {
    type: ACTIVITIES_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldBuildings(key, value) {
  return {
    type: BUILDINGS_UPDATE_FIELD,
    payload: {key, value}
  };
}

export function updateFieldRooms(key, value) {
  return {
    type: ROOMS_UPDATE_FIELD,
    payload: {key, value}
  };
}



export function startAsync() { return { type: ASYNC_START };}
export function endAsync() { return { type: ASYNC_END };}
