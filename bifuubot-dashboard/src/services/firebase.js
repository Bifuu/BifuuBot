import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import { firebaseConfig } from '../config.json';

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const storage = firebase.storage();
