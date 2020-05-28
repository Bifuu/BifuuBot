import firebase from 'firebase';
import { firebaseConfig } from '../config.json';

firebase.initializeApp(firebaseConfig);

export const db = firebase.database();
export const storage = firebase.storage();
