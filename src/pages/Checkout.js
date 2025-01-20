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
  Box,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
              marginBottom: 3,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Subtotal: ${totalPrice.toFixed(2)}
              </Typography>
              <Typography
                variant="body1"
                sx={{ marginBottom: 1, color: "#6E6E73" }}
              >
                GST (12%): ${gst}
              </Typography>
              <Typography
                variant="body1"
                sx={{ marginBottom: 3, color: "#6E6E73" }}
              >
                CGST (18%): ${cgst}
              </Typography>
              <Divider sx={{ marginBottom: 3 }} />
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

              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Select Currency:
              </Typography>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                fullWidth
                sx={{ marginBottom: 3 }}
              >
                {Object.keys(exchangeRates).map((cur) => (
                  <MenuItem key={cur} value={cur}>
                    {cur}
                  </MenuItem>
                ))}
              </Select>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 3,
                  textAlign: "center",
                }}
              >
                Total in {currency}: {convertedAmount.toFixed(2)} {currency}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#0071E3",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: 2,
                  paddingY: 1.5,
                  ":hover": { backgroundColor: "#005BB5" },
                }}
                onClick={handlePayment}
              >
                Pay Now
              </Button>
            </CardContent>
          </Card>
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
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
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
            Payment Successful 🎉
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
              onClick={() => navigate("/")}
              sx={{
                backgroundColor: "#0071E3",
                color: "white",
                ":hover": { backgroundColor: "#005BB5" },
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
