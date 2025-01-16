import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoriteSlice";
import {
  Container,
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
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    if (!product || !product.id) {
      console.error("Invalid product object:", product);
      return;
    }
    dispatch(addToCart({ userEmail: "test@example.com", product }));
    dispatch(toggleFavorite({ userEmail: "test@example.com", product }));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    dispatch(
      updateCartQuantity({
        userEmail: "test@example.com",
        productId,
        quantity: Math.max(1, newQuantity),
      })
    );
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart({ userEmail: "test@example.com", productId }));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Container maxWidth="lg" sx={{ marginTop: 8, display: "flex", gap: 4 }}>
      {/* Favorites List */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
          border: "1px solid #E0E0E0",
          borderRadius: 4,
          overflowY: "auto",
          height: "80vh",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Favorites
        </Typography>
        <AnimatePresence>
          {favorites.map((product) => (
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
                  padding: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={product?.image}
                  alt={product?.name || "Product"}
                  sx={{ width: 80, height: 80 }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{product?.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
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
                        toggleFavorite({
                          userEmail: "test@example.com",
                          product,
                        })
                      )
                    }
                    color="error"
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Box>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* Cart Side */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
          border: "1px solid #E0E0E0",
          borderRadius: 4,
          height: "80vh",
          position: "relative",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Your Cart
        </Typography>
        <Box sx={{ overflowY: "auto", height: "calc(100% - 100px)" }}>
          <AnimatePresence>
            {cart.map((item) => (
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
                    padding: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item?.image}
                    alt={item?.name || "Cart Item"}
                    sx={{ width: 80, height: 80 }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6">{item?.name}</Typography>
                    <Typography variant="body2">
                      ${item?.price} x {item?.quantity}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                      type="number"
                      value={item?.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item.id, Number(e.target.value))
                      }
                      sx={{ width: 80 }}
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
            ))}
          </AnimatePresence>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#F5F5F7",
            padding: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Total: ${totalPrice.toFixed(2)}
          </Typography>
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            sx={{
              backgroundColor: "#0071E3",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              ":hover": {
                backgroundColor: "#005BB5",
              },
            }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Favorites;
