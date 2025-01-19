import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../redux/cartSlice";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "rgba(240, 240, 240, 0.8)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1D1D1F" }}>
          Shopping Cart
        </Typography>
        <Typography variant="body1" sx={{ color: "#6E6E73", marginTop: 2 }}>
          Please log in to view your cart.
        </Typography>
      </Box>
    );
  }

  // Calculate Total Price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate GST and CGST
  const gst = (totalPrice * 0.12).toFixed(2);
  const cgst = (totalPrice * 0.18).toFixed(2);
  const grandTotal = (totalPrice + parseFloat(gst) + parseFloat(cgst)).toFixed(
    2
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(240, 240, 240, 0.8)",
        padding: { xs: 2, md: 4 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          zIndex: 10,
          padding: { xs: 2, md: 4 },
          width: "100%",
          height: "auto", // Adjust height based on content
        }}
      >
        {/* Centered Heading */}
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: "bold",
            marginBottom: 3,
            borderBottom: "1px solid #E0E0E0",
            paddingBottom: 2,
          }}
        >
          Your Cart
        </Typography>

        {/* Content Container: Left and Right Sections */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            height: "100%",
            marginTop: 2,
          }}
        >
          {/* Left Side: Cart Items */}
          <Box
            sx={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              border: "1px solid #E0E0E0",
              borderRadius: 4,
              overflowY: "auto",
              padding: 2,
              maxHeight: "500px", // Prevent overflow on smaller screens
              width: "100%",
            }}
          >
            {cart.map((product) => (
              <Card
                key={product.id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  gap: 2,
                  padding: 2,
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: { xs: "100%", sm: 100 },
                    height: { xs: "auto", sm: 100 },
                    objectFit: "contain",
                  }}
                  image={product.image || "/assets/images/placeholder.jpg"} // Placeholder for missing images
                  alt={product.name || "Unnamed Product"}
                />
                <CardContent sx={{ flex: 1, paddingX: { xs: 0, sm: 2 } }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#1D1D1F" }}
                  >
                    {product.name || "Unnamed Product"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6E6E73", marginBottom: 1 }}
                  >
                    ${product.price ? product.price : "N/A"} x{" "}
                    {product.quantity}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#0071E3" }}
                  >
                    Total: $
                    {product.price
                      ? (product.price * product.quantity).toFixed(2)
                      : "0.00"}
                  </Typography>
                </CardContent>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    type="number"
                    value={product.quantity}
                    onChange={(e) => {
                      const newQuantity = Math.max(1, Number(e.target.value));
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
                  <IconButton
                    sx={{ color: "gray" }}
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          userEmail: user.email,
                          productId: product.id,
                        })
                      )
                    }
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Right Side: Total, Taxes, and Checkout */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #E0E0E0",
              borderRadius: 4,
              padding: { xs: 2, sm: 3 },
              backgroundColor: "#F9F9F9",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
              width: "100%",
              maxWidth: "400px", // Limit right-side width for better layout
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#1D1D1F",
                marginBottom: 2,
                textAlign: "center",
              }}
            >
              Subtotal: ${totalPrice.toFixed(2)}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6E6E73",
                marginBottom: 1,
                textAlign: "center",
              }}
            >
              GST (12%): ${gst}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6E6E73",
                marginBottom: 3,
                textAlign: "center",
              }}
            >
              CGST (18%): ${cgst}
            </Typography>
            <Divider sx={{ width: "100%", marginBottom: 3 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#0071E3",
                marginBottom: 3,
                textAlign: "center",
              }}
            >
              Grand Total: ${grandTotal}
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
                width: "100%",
                ":hover": {
                  backgroundColor: "#005BB5",
                },
              }}
            >
              Proceed to Payment
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Cart;
