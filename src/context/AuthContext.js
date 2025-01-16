import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../firebaseConfig";
import { useDispatch } from "react-redux";
import { fetchCartFromFirebase } from "../redux/cartSlice";
import { fetchFavoritesFromFirebase } from "../redux/favoriteSlice";

export const AuthContext = createContext();

const formatUserName = (name) =>
  name
    ? name
        .trim()
        .replace(/[0-9]/g, "")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "User";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
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

        localStorage.setItem("user", JSON.stringify(formattedUser));
        setUser(formattedUser);

        // Fetch Firebase data
        dispatch(fetchCartFromFirebase(formattedUser.email));
        dispatch(fetchFavoritesFromFirebase(formattedUser.email));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
