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
  apiKey: "xxxxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xx",
  messagingSenderId: "x",
  appId: "x",
  measurementId: "x",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Google Sign-In Function
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

// Get the Current User
const getCurrentUser = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("👤 User Logged In: ", user.email);
    } else {
      console.log("🔓 No User Logged In");
    }
    callback(user);
  });
};

// Save Cart to Firebase
const saveCartToFirebase = async (userEmail, cart) => {
  if (!userEmail) {
    console.error("❌ No user email provided. Cannot save cart.");
    return;
  }

  try {
    console.log("🚀 Attempting to save cart to Firestore for:", userEmail);
    await setDoc(doc(db, "carts", userEmail), { cart });
    console.log("✅ Cart saved successfully for:", userEmail);
  } catch (error) {
    console.error("🔥 Error saving cart to Firestore:", error.message);
  }
};

// Load Cart from Firebase
const loadCartFromFirebase = async (userEmail) => {
  if (!userEmail) {
    console.error("❌ No user email provided. Cannot load cart.");
    return [];
  }

  try {
    const cartDoc = await getDoc(doc(db, "carts", userEmail));
    if (cartDoc.exists()) {
      console.log("📦 Cart loaded for:", userEmail, cartDoc.data().cart);
      return cartDoc.data().cart;
    } else {
      console.log("🛒 No cart found for:", userEmail);
      return [];
    }
  } catch (error) {
    console.error("🔥 Error loading cart from Firestore:", error.message);
    return [];
  }
};

export {
  auth,
  db,
  saveCartToFirebase,
  loadCartFromFirebase,
  getCurrentUser,
  signInWithGoogle,
};
