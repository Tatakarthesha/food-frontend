import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCeadbrBKzl19p3DTYkwh8sjnEiz63Ms7M",
  authDomain: "food-be158.firebaseapp.com",
  projectId: "food-be158",
  storageBucket: "food-be158.appspot.com",
  messagingSenderId: "807717386744",
  appId: "1:807717386744:web:16c109e18b8d29e5313e0d",
  measurementId: "G-GJYGPSECL2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
