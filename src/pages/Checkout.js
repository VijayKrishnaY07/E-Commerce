import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CartPlaceholder from "../assets/images/shopping-cart.jpeg"; // Linking the placeholder image
import CreditCardIcon from "../assets/images/credit-card.svg";
const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [open, setOpen] = useState(false);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const gst = (totalPrice * 0.12).toFixed(2);
  const cgst = (totalPrice * 0.18).toFixed(2);
  const grandTotal = (totalPrice + parseFloat(gst) + parseFloat(cgst)).toFixed(
    2
  );

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        setExchangeRates({ USD: 1 });
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    setConvertedAmount(grandTotal * (exchangeRates[currency] || 1));
  }, [grandTotal, exchangeRates, currency]);

  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add items to proceed.");
      return;
    }

    setOpen(true);

    if (user) {
      dispatch(clearCart(user.email));
    }
  };

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
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          zIndex: 10,
          padding: { xs: 3, md: 4 },
          width: "100%",
        }}
      >
        {/* Heading */}
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
          Checkout
        </Typography>

        {cart.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 2,
            }}
          >
            <img
              src={CartPlaceholder} // Linking the placeholder image
              alt="Empty Cart"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "contain",
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#6E6E73" }}
            >
              Your cart is empty.
            </Typography>
            <Typography variant="body2" sx={{ color: "#A1A1A6" }}>
              Looks like you haven’t added anything to your cart yet.
            </Typography>
            <Button
              onClick={() => navigate("/products")}
              sx={{
                marginTop: 2,
                backgroundColor: "#1d1d1f",
                color: "white",
                textTransform: "uppercase",
                fontWeight: "bold",
                ":hover": { backgroundColor: "#000" },
              }}
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Box>
            {/* Credit Card Image */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 3,
              }}
            >
              <img
                src={CreditCardIcon} // Updated to use the imported SVG
                alt="Credit Card"
                style={{
                  width: "200px",
                  height: "120px",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Currency and Subtotal Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              <Box>
                <Typography variant="h6">Select Currency:</Typography>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  sx={{ width: "120px", marginTop: 1 }}
                >
                  {Object.keys(exchangeRates).map((cur) => (
                    <MenuItem key={cur} value={cur}>
                      {cur}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Subtotal: ${totalPrice.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6E6E73", marginTop: 1 }}
                >
                  GST (12%): ${gst}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6E6E73", marginTop: 0.5 }}
                >
                  CGST (18%): ${cgst}
                </Typography>
              </Box>
            </Box>

            {/* Grand Total */}
            <Typography
              variant="h5"
              align="center"
              sx={{
                fontWeight: "bold",
                color: "#0071E3",
                marginBottom: 3,
              }}
            >
              Grand Total: {convertedAmount.toFixed(2)} {currency}
            </Typography>

            {/* Pay Now Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#1d1d1f",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: 2,
                paddingY: 1.5,
                ":hover": { backgroundColor: "#000" },
              }}
              onClick={handlePayment}
            >
              Pay Now
            </Button>
          </Box>
        )}

        {/* Payment Success Dialog */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              padding: { xs: 2, md: 4 },
              borderRadius: 3,
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.4)",
              backgroundColor: "white",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#0071E3",
              textAlign: "center",
              gap: 1,
            }}
          >
            <CheckCircleIcon fontSize="large" sx={{ color: "#4CAF50" }} />
            <Typography
              fontSize="large"
              fontWeight="bold"
              sx={{ color: "black" }}
            >
              Payment Successful
            </Typography>
          </DialogTitle>
          <DialogContent
            sx={{
              textAlign: "center",
              backgroundColor: "#F9F9F9",
            }}
          >
            <Typography variant="body1" sx={{ marginBottom: 3 }}>
              Thank you for your purchase!
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#6E6E73", fontStyle: "italic" }}
            >
              You will receive a confirmation email shortly.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
              sx={{
                backgroundColor: "#1d1d1f",
                color: "white",
                ":hover": { backgroundColor: "#000" },
                paddingX: 4,
                borderRadius: 2,
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Checkout;
