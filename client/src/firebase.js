import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "it-guru-blog.firebaseapp.com",
  projectId: "it-guru-blog",
  storageBucket: "it-guru-blog.appspot.com",
  messagingSenderId: "162331569884",
  appId: "1:162331569884:web:1ea2d07fba1a2ca016ce19"
};
export const app = initializeApp(firebaseConfig);