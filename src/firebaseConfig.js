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
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_MEASUREMENT_ID,
};

export default firebaseConfig;

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

// **Save data to Firebase**
const saveToFirebase = async (collection, userEmail, data) => {
  if (!userEmail) {
    throw new Error("❌ User email is required for Firestore operations.");
  }

  try {
    await setDoc(doc(db, collection, userEmail), data);
    console.log(`✅ Data saved to ${collection} for:`, userEmail);
  } catch (error) {
    console.error(`🔥 Error saving to ${collection}:`, error.message);
    throw error;
  }
};

// **Load data from Firebase**
const loadFromFirebase = async (collection, userEmail) => {
  if (!userEmail) {
    throw new Error("❌ User email is required for Firestore operations.");
  }

  try {
    const docRef = doc(db, collection, userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(
        `📦 Data loaded from ${collection} for:`,

        userEmail,
        docSnap.data()
      );
      return docSnap.data();
    } else {
      console.log(`🔍 No data found in ${collection} for:`, userEmail);
      return null;
    }
  } catch (error) {
    console.error(`🔥 Error loading from ${collection}:`, error.message);
    throw error;
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
const saveFavoritesToFirebase = async (userEmail, favorites) =>
  saveToFirebase("favorites", userEmail, { favorites });

const loadFavoritesFromFirebase = async (userEmail) => {
  const data = await loadFromFirebase("favorites", userEmail);
  return data ? data.favorites : [];
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
