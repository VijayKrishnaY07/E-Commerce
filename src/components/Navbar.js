import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const cart = useSelector((state) => state.cart);
  const favorites = useSelector((state) => state.favorites);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Utility function to capitalize the first letter of the name
  const capitalizeName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#000000",
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
          {/* Mobile Hamburger Menu */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Store Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#FFFFFF",
              letterSpacing: "0.8px",
              marginRight: { xs: 2 }, // Add padding on small screens
            }}
          >
            Apple Store
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
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
                color: "#FFFFFF",
                ":hover": { color: "#A1A1A6" },
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
                    color: "#FFFFFF",
                  }}
                >
                  {capitalizeName(user.name)}
                </Typography>
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    color: "#FF3B30",
                    ":hover": { color: "#C22C21" },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
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

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 250,
            backgroundColor: "#000000",
            color: "#FFFFFF",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Menu
          </Typography>
          <IconButton
            onClick={() => setIsDrawerOpen(false)}
            sx={{ color: "#FFFFFF" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: "#A1A1A6" }} />
        <List>
          <ListItem
            button
            component={Link}
            to="/"
            onClick={() => setIsDrawerOpen(false)}
            sx={{ color: "#FFFFFF" }} // White color for all menu items
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/products"
            onClick={() => setIsDrawerOpen(false)}
            sx={{ color: "#FFFFFF" }}
          >
            <ListItemText primary="Products" />
          </ListItem>
          {user && (
            <>
              <ListItem
                button
                component={Link}
                to="/favorites"
                onClick={() => setIsDrawerOpen(false)}
                sx={{ color: "#FFFFFF" }}
              >
                <FavoriteOutlinedIcon sx={{ marginRight: 1 }} />
                <ListItemText primary={`Favorites (${favorites.length})`} />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/cart"
                onClick={() => setIsDrawerOpen(false)}
                sx={{ color: "#FFFFFF" }}
              >
                <ShoppingBagOutlinedIcon sx={{ marginRight: 1 }} />
                <ListItemText primary={`Cart (${cartItemCount})`} />
              </ListItem>
            </>
          )}
          {user ? (
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                color: "#FF3B30", // Red color for Logout
              }}
            >
              <LogoutIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <ListItem
              button
              component={Link}
              to="/signin"
              onClick={() => setIsDrawerOpen(false)}
              sx={{ color: "#FFFFFF" }}
            >
              <ListItemText primary="Signin" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
