import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import firebaseConfig from "@/firebase/firebaseConfig";

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp.firestore()