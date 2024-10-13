import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBGMw8quUSuaC1moQEtI1fAKNW51rCn4tA",
  authDomain: "react-native-4edfd.firebaseapp.com",
  databaseURL:"https://react-native-4edfd-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "react-native-4edfd",
  storageBucket: "react-native-4edfd.appspot.com",
  messagingSenderId: "724164581498",
  appId: "1:724164581498:web:f3ca8b3338a26f60e903c3",
  measurementId: "G-S609751NX6"
};
// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Auth với AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const database = getDatabase(app);

export { auth, database };
