import React, { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../firebaseConfig";
import { useDispatch } from "react-redux";
import { fetchCartFromFirebase } from "../redux/cartSlice";
import { fetchFavoritesFromFirebase } from "../redux/favoriteSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export const AuthContext = createContext();

const SESSION_TIMEOUT = 5 * 60 * 1000; // 1 minutes in milliseconds

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isSessionTimedOut, setIsSessionTimedOut] = useState(false);
  const dispatch = useDispatch();

  // Function to handle sign-out due to timeout
  const handleSignOut = useCallback(() => {
    signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
    setIsSessionTimedOut(true); // To trigger the session timeout message
  }, []);

  // Function to reset the session timeout timer
  const resetTimer = useCallback(() => {
    if (isSessionTimedOut) setIsSessionTimedOut(false);
    clearTimeout(window.sessionTimeout);
    window.sessionTimeout = setTimeout(handleSignOut, SESSION_TIMEOUT);
  }, [handleSignOut, isSessionTimedOut]);

  // Setup event listeners for user interactions
  useEffect(() => {
    if (user) {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);

      resetTimer(); // Start the timer initially

      return () => {
        // Cleanup event listeners and timers
        clearTimeout(window.sessionTimeout);
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keydown", resetTimer);
        window.removeEventListener("click", resetTimer);
      };
    }
  }, [user, resetTimer]);

  // Listen for user state changes
  useEffect(() => {
    getCurrentUser((firebaseUser) => {
      if (firebaseUser) {
        const formattedUser = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        };

        localStorage.setItem("user", JSON.stringify(formattedUser));
        setUser(formattedUser);

        // Fetch cart and favorites data from Firebase
        dispatch(fetchCartFromFirebase(formattedUser.email));
        dispatch(fetchFavoritesFromFirebase(formattedUser.email));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{ user, isSessionTimedOut, setIsSessionTimedOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
