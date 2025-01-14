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
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [open, setOpen] = useState(false);

  // Fetch exchange rates on component mount
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Calculate total amount
  useEffect(() => {
    let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
    setConvertedAmount(total * (exchangeRates[currency] || 1));
  }, [cart, exchangeRates, currency]);

  // Handle currency conversion
  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    setConvertedAmount(totalAmount * (exchangeRates[event.target.value] || 1));
  };

  // Handle payment success and cart clearing
  const handlePayment = () => {
    setOpen(true);

    // ✅ Clear the cart in Redux and Firebase
    if (user) {
      dispatch(clearCart(user.email));
    }

    setTimeout(() => {
      setOpen(false);
      navigate("/");
    }, 2000);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 8, paddingBottom: 5 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: "bold", color: "#1D1D1F", marginBottom: 3 }}
      >
        Checkout
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
        <Card
          sx={{
            padding: 3,
            borderRadius: 4,
            boxShadow: 3,
            backgroundColor: "#FFFFFF",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "#6E6E73", marginBottom: 1 }}>
              Total Amount to Pay:
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#0071E3", marginBottom: 3 }}
            >
              {convertedAmount.toFixed(2)} {currency}
            </Typography>

            <Typography variant="h6" sx={{ color: "#6E6E73", marginBottom: 1 }}>
              Convert Currency:
            </Typography>
            <Select
              value={currency}
              onChange={handleCurrencyChange}
              fullWidth
              sx={{
                backgroundColor: "#F5F5F7",
                borderRadius: "8px",
                marginBottom: 3,
              }}
            >
              {Object.keys(exchangeRates).map((cur) => (
                <MenuItem key={cur} value={cur}>
                  {cur}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#0071E3",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                paddingY: 1.5,
                ":hover": {
                  backgroundColor: "#005BB5",
                },
              }}
              onClick={handlePayment}
            >
              Pay
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ✅ Payment Success Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          sx={{ fontWeight: "bold", color: "#0071E3", textAlign: "center" }}
        >
          Payment Successful 🎉
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{ color: "#1D1D1F", textAlign: "center" }}
          >
            Thank you for your purchase!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: 3 }}>
          <Button
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#0071E3",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              paddingX: 3,
              ":hover": {
                backgroundColor: "#005BB5",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Checkout;
