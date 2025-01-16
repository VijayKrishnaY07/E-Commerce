import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import products from "../data/products";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  Button,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <Typography
        variant="h5"
        align="center"
        sx={{ marginTop: "50px", color: "#1D1D1F" }}
      >
        Product not found
      </Typography>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to the cart.");
      return;
    }

    dispatch(addToCart({ userEmail: user.email, product }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 10, paddingBottom: 5 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 4,
          padding: 4,
          backgroundColor: "#FFFFFF",
        }}
      >
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: "auto", md: "400px" },
            objectFit: "contain",
            borderRadius: 3,
          }}
        />
        <Box sx={{ flex: 1, paddingX: { xs: 0, md: 4 }, textAlign: "left" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "#FF3B30", marginBottom: 1 }}
          >
            New
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#1D1D1F", marginBottom: 2 }}
          >
            {product.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#6E6E73", marginBottom: 3 }}
          >
            {product.description}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#0071E3", marginBottom: 3 }}
          >
            ${product.price}
          </Typography>
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
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default ProductPage;
