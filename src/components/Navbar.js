import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const cart = useSelector((state) => state.cart);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#F5F5F7",
        boxShadow: 0,
        borderBottom: "1px solid #D1D1D6",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* ✅ Left: Store Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#1D1D1F",
              letterSpacing: "0.8px",
            }}
          >
            Tech Gadgets Store
          </Typography>

          {/* ✅ Right: Navigation */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{ fontSize: "1rem", fontWeight: 500, color: "#1D1D1F" }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/products"
              sx={{ fontSize: "1rem", fontWeight: 500, color: "#1D1D1F" }}
            >
              Products
            </Button>
            {user && (
              <Button
                color="inherit"
                component={Link}
                to="/cart"
                sx={{ fontSize: "1rem", fontWeight: 500, color: "#1D1D1F" }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{
                    fontSize: "1.2rem",
                    marginRight: "5px",
                    color: "#1D1D1F",
                  }}
                />
                Cart ({cartItemCount})
              </Button>
            )}
            {user ? (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    maxWidth: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#1D1D1F",
                  }}
                >
                  {user.name}
                </Typography>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ fontSize: "1rem", fontWeight: 500, color: "#1D1D1F" }}
                >
                  Signout
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to="/signin"
                sx={{ fontSize: "1rem", fontWeight: 500, color: "#1D1D1F" }}
              >
                Sign-in
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
