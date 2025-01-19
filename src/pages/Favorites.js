import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, fetchCartFromFirebase } from "../redux/cartSlice";
import {
  toggleFavorite,
  fetchFavoritesFromFirebase,
} from "../redux/favoriteSlice";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateCartQuantity, removeFromCart } from "../redux/cartSlice";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch cart and favorites data on component mount
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

    // Add to cart and persist in Firebase
    dispatch(addToCart({ userEmail: user.email, product }));

    // Remove from favorites and persist in Firebase
    dispatch(toggleFavorite({ userEmail: user.email, product }));

    toast.success(`${product.name} moved to cart!`);
  };

  const handleCheckout = () => {
    if (!cart.length) {
      toast.error("Your cart is empty. Add items before proceeding.");
      return;
    }
    navigate("/cart");
  };

  // const totalPrice = cart.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(240, 240, 240, 0.8)",
        padding: 2,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          gap: 4,
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          zIndex: 10,
          padding: 4,
          width: "80%",
          height: "650px",
        }}
      >
        {/* Favorites List */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            border: "1px solid #E0E0E0",
            borderRadius: 4,
            overflowY: "auto",
            height: "100%",
            padding: 2,
          }}
        >
          <Typography
            align="center"
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: 2 }}
          >
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
                  sx={{ display: "flex", alignItems: "center", padding: 2 }}
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
            border: "1px solid #E0E0E0",
            borderRadius: 4,
            overflowY: "auto",
            height: "100%",
            padding: 2,
          }}
        >
          <Typography
            align="center"
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: 2 }}
          >
            Your Cart
          </Typography>
          <Box>
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
                    sx={{ display: "flex", alignItems: "center", padding: 2 }}
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
                        onChange={(e) => {
                          const newQuantity = Math.max(
                            1,
                            Number(e.target.value)
                          );
                          dispatch(
                            updateCartQuantity({
                              userEmail: user.email,
                              productId: item.id,
                              quantity: newQuantity,
                            })
                          );
                        }}
                        sx={{
                          width: "60px",
                          "& input": {
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: "bold",
                          },
                        }}
                      />
                      <IconButton
                        sx={{ color: "gray" }}
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              userEmail: user.email,
                              productId: item.id,
                            })
                          )
                        }
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
          <Box sx={{ marginTop: "auto" }}>
            {/* <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
              Total: ${totalPrice.toFixed(2)}
            </Typography> */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0071E3",
                color: "white",
                ":hover": { backgroundColor: "#005BB5" },
              }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Favorites;
