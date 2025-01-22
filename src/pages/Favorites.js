import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  fetchCartFromFirebase,
  removeFromCart,
  updateCartQuantity,
} from "../redux/cartSlice";
import {
  toggleFavorite,
  fetchFavoritesFromFirebase,
} from "../redux/favoriteSlice";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchCartFromFirebase(user.email));
      dispatch(fetchFavoritesFromFirebase(user.email));
    }
  }, [dispatch, user]);

  const handleAddToCart = (product) => {
    if (!product || !product.id) {
      console.error("Invalid product object:", product);
      return;
    }
    if (!user?.email) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }
    dispatch(addToCart({ userEmail: user.email, product }));
    dispatch(toggleFavorite({ userEmail: user.email, product }));
    toast.success(`${product.name} moved to cart!`);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (!user?.email) {
      toast.error("You must be logged in to update cart items.");
      return;
    }
    dispatch(
      updateCartQuantity({
        userEmail: user.email,
        productId,
        quantity: newQuantity,
      })
    );
  };

  const handleRemoveFromCart = (productId) => {
    if (!user?.email) {
      toast.error("You must be logged in to remove cart items.");
      return;
    }
    dispatch(
      removeFromCart({
        userEmail: user.email,
        productId,
      })
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        padding: "50px 4px",
        backgroundColor: "#F5F5F5",
      }}
    >
      {/* Favorites List */}
      <Box
        sx={{
          flex: 1,
          maxWidth: "40%",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 4,
          overflow: "hidden",
          padding: 3,
          backgroundColor: "#F7F7F7",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          align="center"
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: 2 }}
        >
          Favorites
        </Typography>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <AnimatePresence>
            {favorites.length > 0 ? (
              favorites.map((product) => (
                <motion.div
                  key={product?.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: 1.5,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product?.image}
                      alt={product?.name || "Product"}
                      sx={{ width: 60, height: 60 }}
                    />
                    <CardContent sx={{ flex: 1, padding: "0 8px" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {product?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginTop: "4px" }}
                      >
                        ${product?.price}
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton onClick={() => handleAddToCart(product)}>
                        <ShoppingCartOutlinedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          dispatch(
                            toggleFavorite({ userEmail: user.email, product })
                          )
                        }
                        color="error"
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "#A1A1A6",
                }}
              >
                <SentimentDissatisfiedIcon
                  sx={{ fontSize: 50, marginBottom: 1 }}
                />
                <Typography variant="body1" sx={{ color: "#6E6E73" }}>
                  No items are added to favorites.
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Cart Side */}
      <Box
        sx={{
          flex: 1,
          maxWidth: "40%",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 4,
          overflow: "hidden",
          padding: 3,
          backgroundColor: "#F7F7F7",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          align="center"
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: 2 }}
        >
          Your Cart
        </Typography>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <AnimatePresence>
            {cart.length > 0 ? (
              cart.map((item) => (
                <motion.div
                  key={item?.id}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: 1.5,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item?.image}
                      alt={item?.name || "Cart Item"}
                      sx={{ width: 60, height: 60 }}
                    />
                    <CardContent sx={{ flex: 1, padding: "0 8px" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {item?.name}
                      </Typography>
                      <Typography variant="body2" sx={{ marginTop: "4px" }}>
                        ${item?.price} x {item?.quantity}
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TextField
                        type="number"
                        value={item?.quantity}
                        onChange={(e) => {
                          const newQuantity = Math.max(
                            1,
                            Number(e.target.value)
                          );
                          handleUpdateQuantity(item.id, newQuantity);
                        }}
                        sx={{
                          width: "50px",
                          "& input": {
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "bold",
                          },
                        }}
                      />
                      <IconButton
                        sx={{ color: "gray" }}
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "#A1A1A6",
                }}
              >
                <SentimentDissatisfiedIcon
                  sx={{ fontSize: 50, marginBottom: 1 }}
                />
                <Typography variant="body1" sx={{ color: "#6E6E73" }}>
                  Your cart is empty.
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>
        <Box sx={{ marginTop: "auto", padding: 2, textAlign: "center" }}>
          <Button
            onClick={() => navigate("/cart")}
            variant="contained"
            sx={{
              backgroundColor: "#1d1d1f",
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "14px",
              paddingX: 3,
              paddingY: 1,
              borderRadius: "8px",
              textTransform: "uppercase",
              ":hover": { backgroundColor: "#000" },
            }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Favorites;
