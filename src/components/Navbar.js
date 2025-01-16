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
    <AppBar position="fixed" sx={{ backgroundColor: "#0071E3", boxShadow: 0 }}>
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
            sx={{ fontWeight: "bold", color: "white", letterSpacing: "0.8px" }}
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
              color="inherit"
              component={Link}
              to="/"
              sx={{ fontSize: "1rem", fontWeight: 500 }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/products"
              sx={{ fontSize: "1rem", fontWeight: 500 }}
            >
              Products
            </Button>
            {user && (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/favorites"
                  sx={{ fontSize: "1rem", fontWeight: 500 }}
                >
                  <FavoriteOutlinedIcon
                    sx={{ fontSize: "1.2rem", marginRight: "5px" }}
                  />
                  Favorites ({favorites.length})
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/cart"
                  sx={{ fontSize: "1rem", fontWeight: 500 }}
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
                  }}
                >
                  {user.name}
                </Typography>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ fontSize: "1rem", fontWeight: 500 }}
                >
                  Signout
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to="/signin"
                sx={{ fontSize: "1rem", fontWeight: 500 }}
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
