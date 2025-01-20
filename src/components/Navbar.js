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
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const cart = useSelector((state) => state.cart);
  const favorites = useSelector((state) => state.favorites);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#000000", // Apple's iPhone page uses a black header
        boxShadow: 0,
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
          {/* Store Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#FFFFFF", // White text on black background
              letterSpacing: "0.8px",
            }}
          >
            Tech Gadgets Store
          </Typography>

          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            <Button
              component={Link}
              to="/"
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                color: "#FFFFFF", // White links
                ":hover": { color: "#A1A1A6" }, // Light gray hover
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/products"
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                color: "#FFFFFF",
                ":hover": { color: "#A1A1A6" },
              }}
            >
              Products
            </Button>
            {user && (
              <>
                <Button
                  component={Link}
                  to="/favorites"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    ":hover": { color: "#A1A1A6" },
                  }}
                >
                  <FavoriteOutlinedIcon
                    sx={{ fontSize: "1.2rem", marginRight: "5px" }}
                  />
                  Favorites ({favorites.length})
                </Button>
                <Button
                  component={Link}
                  to="/cart"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    ":hover": { color: "#A1A1A6" },
                  }}
                >
                  <ShoppingBagOutlinedIcon
                    sx={{ fontSize: "1.2rem", marginRight: "5px" }}
                  />
                  Cart ({cartItemCount})
                </Button>
              </>
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
                    color: "#FFFFFF", // White text for user name
                  }}
                >
                  {user.name}
                </Typography>
                <Button
                  onClick={handleLogout}
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#FF3B30", // Apple's red for sign-out (close buttons)
                    ":hover": { color: "#C22C21" }, // Darker red on hover
                  }}
                >
                  Signout
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                to="/signin"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  ":hover": { color: "#A1A1A6" },
                }}
              >
                Signin
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
