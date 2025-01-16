import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
  measurementId: "xxx",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// **Function: Sign in with Google**
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google User: ", result.user);
    return result.user;
  } catch (error) {
    console.error("🔥 Google Sign-In Error: ", error.message);
    throw error;
  }
};

// **Function: Get current authenticated user**
const getCurrentUser = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Save and Load Data Helpers
const saveToFirebase = async (collection, userEmail, data) => {
  if (!userEmail)
    throw new Error("User email is required for Firestore operations.");
  try {
    await setDoc(doc(db, collection, userEmail), data);
  } catch (error) {
    console.error(`Error saving to ${collection}:`, error.message);
  }
};

const loadFromFirebase = async (collection, userEmail) => {
  if (!userEmail)
    throw new Error("User email is required for Firestore operations.");
  try {
    const docRef = doc(db, collection, userEmail);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error(`Error loading from ${collection}:`, error.message);
    return null;
  }
};

// Save/Load Cart
const saveCartToFirebase = async (userEmail, cart) =>
  saveToFirebase("carts", userEmail, { cart });
const loadCartFromFirebase = async (userEmail) => {
  const data = await loadFromFirebase("carts", userEmail);
  return data ? data.cart : [];
};

// Save/Load Favorites
const saveFavoritesToFirebase = async (userEmail, favorites) => {
  try {
    console.log("Saving favorites to Firebase:", favorites);
    await setDoc(doc(db, "favorites", userEmail), { favorites });
  } catch (error) {
    console.error("Error saving favorites to Firebase:", error.message);
  }
};

const loadFavoritesFromFirebase = async (userEmail) => {
  try {
    const docRef = doc(db, "favorites", userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Favorites loaded from Firebase:", docSnap.data().favorites);
      return docSnap.data().favorites;
    } else {
      console.log("No favorites found for:", userEmail);
      return [];
    }
  } catch (error) {
    console.error("Error loading favorites from Firebase:", error.message);
    throw error;
  }
};
export {
  auth,
  db,
  signInWithGoogle,
  getCurrentUser,
  saveCartToFirebase,
  loadCartFromFirebase,
  saveFavoritesToFirebase,
  loadFavoritesFromFirebase,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
};
