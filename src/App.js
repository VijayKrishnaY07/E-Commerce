import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/SignUp";
import Signin from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkout from "./pages/Checkout";

const App = () => {
  const { isSessionTimedOut, setIsSessionTimedOut } = useContext(AuthContext);
  const [showTimeoutPopup, setShowTimeoutPopup] = useState(false);

  useEffect(() => {
    if (isSessionTimedOut) {
      setShowTimeoutPopup(true);
    }
  }, [isSessionTimedOut]);

  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Session Timeout Popup */}
      {showTimeoutPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 10px" }}>Session Timeout</h3>
            <p style={{ margin: "0 0 20px" }}>
              Your session has expired due to inactivity.
            </p>
            <button
              style={{
                backgroundColor: "#0071E3",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowTimeoutPopup(false);
                setIsSessionTimedOut(false); // Reset session timeout
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
