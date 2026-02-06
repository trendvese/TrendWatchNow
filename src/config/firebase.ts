// Firebase Configuration for TrendVerse Blog
// Project: trendverse-blog

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWFTFURcMBRyx6HOmJthztbAbFI6xpC38",
  authDomain: "trendverse-blog.firebaseapp.com",
  projectId: "trendverse-blog",
  storageBucket: "trendverse-blog.firebasestorage.app",
  messagingSenderId: "232454722910",
  appId: "1:232454722910:web:b372f7bae091285a266bcf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
