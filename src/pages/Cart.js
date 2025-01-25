import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../redux/cartSlice";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  IconButton,
  Box,
  Divider,
  useMediaQuery,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const isMobile = useMediaQuery("(max-width:768px)");

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "#F5F5F5",
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
        backgroundColor: "#F5F5F5",
        padding: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {/* Left Side: Cart Items */}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 4,
            backgroundColor: "#F7F7F7",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            padding: 3,
            maxHeight: { md: "600px" }, // Fixed height for larger screens
            overflowY: { md: "auto" },
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 2,
              color: "#1D1D1F",
            }}
          >
            Your Cart
          </Typography>
          {cart.length > 0 ? (
            cart.map((product) => (
              <Card
                key={product.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 1,
                  height: isMobile ? "70px" : "auto",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardMedia
                  component="img"
                  image={product.image || "/assets/images/placeholder.jpg"} // Placeholder for missing images
                  alt={product.name || "Unnamed Product"}
                  sx={{
                    width: isMobile ? 50 : 80,
                    height: isMobile ? 50 : 80,
                    borderRadius: "8px",
                    objectFit: "contain",
                  }}
                />
                <CardContent
                  sx={{
                    flex: 1,
                    padding: "0 8px",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 500,
                      fontSize: isMobile ? "14px" : "16px",
                      color: "#1D1D1F",
                    }}
                  >
                    {product.name || "Unnamed Product"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6E6E73",
                    }}
                  >
                    ${product.price} x {product.quantity}
                  </Typography>
                  {!isMobile && (
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#0071E3",
                      }}
                    >
                      Total: ${(product.price * product.quantity).toFixed(2)}
                    </Typography>
                  )}
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isMobile ? "center" : "flex-end",
                    gap: 1,
                  }}
                >
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
                      width: isMobile ? 50 : 60,
                      "& input": {
                        textAlign: "center",
                        fontSize: isMobile ? "12px" : "14px",
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
                Your cart is empty. Add items to get started!
              </Typography>
            </Box>
          )}
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
            backgroundColor: "#F7F7F7",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <ShoppingCartOutlinedIcon
            sx={{
              fontSize: 60,
              color: "#0071E3",
              marginBottom: 2,
            }}
          />
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
              backgroundColor: "#1d1d1f",
              color: "white",
              fontSize: { xs: "14px", sm: "16px" },
              fontWeight: "bold",
              borderRadius: "8px",
              paddingY: 1.5,
              width: "100%",
              ":hover": {
                backgroundColor: "#000",
              },
            }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
