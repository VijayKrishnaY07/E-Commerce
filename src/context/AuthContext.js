import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../firebaseConfig";
import { useDispatch } from "react-redux";
import { fetchCartFromFirebase } from "../redux/cartSlice";

export const AuthContext = createContext();

const formatUserName = (name) => {
  if (!name) return "User";

  return name
    .trim() // ✅ Remove extra spaces
    .replace(/[0-9]/g, "") // ✅ Remove numbers
    .split(/\s+/) // ✅ Split by spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // ✅ Capitalize
    .join(" "); // ✅ Rejoin words
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser((firebaseUser) => {
      if (firebaseUser) {
        const formattedUser = {
          email: firebaseUser.email,
          name: formatUserName(
            firebaseUser.displayName || firebaseUser.email.split("@")[0]
          ),
        };
        setUser(formattedUser);
        dispatch(fetchCartFromFirebase(formattedUser.email)); // ✅ Load cart with user email
      } else {
        setUser(null);
      }
    });
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
