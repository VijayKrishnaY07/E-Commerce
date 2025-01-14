import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../redux/cartSlice";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  Divider,
  TextField,
  Card,
  CardMedia,
  Box,
} from "@mui/material";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext); // ✅ Get logged-in user's email

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ paddingY: 5, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1D1D1F" }}>
          Shopping Cart
        </Typography>
        <Typography variant="body1" sx={{ color: "#6E6E73" }}>
          Please log in to view your cart.
        </Typography>
      </Container>
    );
  }

  // Calculate Total Price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Container maxWidth="md" sx={{ marginTop: 8, paddingBottom: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1D1D1F" }}
      >
        Shopping Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography
          variant="body1"
          align="center"
          sx={{ color: "#6E6E73", marginTop: 3 }}
        >
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <List>
            {cart.map((product) => (
              <React.Fragment key={product.id}>
                <ListItem sx={{ justifyContent: "center" }}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "center",
                      width: "100%",
                      padding: 2,
                      boxShadow: 3,
                      borderRadius: 4,
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {/* ✅ Product Image */}
                    <CardMedia
                      component="img"
                      sx={{
                        width: { xs: "100%", sm: 100 },
                        height: { xs: "auto", sm: 100 },
                        objectFit: "contain",
                        borderRadius: 3,
                      }}
                      image={product.image}
                      alt={product.name}
                    />

                    {/* ✅ Product Details */}
                    <Box
                      sx={{
                        flexGrow: 1,
                        paddingX: 3,
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#1D1D1F" }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6E6E73", marginBottom: 1 }}
                      >
                        ${product.price} x {product.quantity}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#0071E3" }}
                      >
                        ${product.price * product.quantity}
                      </Typography>
                    </Box>

                    {/* ✅ Quantity & Remove Button */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <TextField
                        type="number"
                        value={product.quantity}
                        onChange={(e) => {
                          const newQuantity = Math.max(
                            1,
                            Number(e.target.value)
                          );
                          dispatch(
                            updateCartQuantity({
                              userEmail: user.email,
                              productId: product.id,
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
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#FF3B30",
                          color: "#FF3B30",
                          fontWeight: "bold",
                          ":hover": {
                            backgroundColor: "#FF3B30",
                            color: "white",
                          },
                        }}
                        onClick={() => {
                          dispatch(
                            removeFromCart({
                              userEmail: user.email,
                              productId: product.id,
                            })
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Card>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          {/* ✅ Total Price & Checkout */}
          <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1D1D1F" }}
            >
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
                borderRadius: "8px",
                paddingY: 1.5,
                marginTop: 2,
                ":hover": {
                  backgroundColor: "#005BB5",
                },
              }}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Cart;
