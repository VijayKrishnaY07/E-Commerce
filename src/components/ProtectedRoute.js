import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  //If user is not logged in, redirect to signin Page

  return user ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
