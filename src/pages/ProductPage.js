import React from "react";
import { useParams } from "react-router-dom";
import products from "../data/products";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import {
  CardContent,
  Typography,
  Card,
  CardMedia,
  Button,
  Container,
} from "@mui/material";
import { toast } from "react-toastify";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Convert ID to number and find the product
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
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 8, paddingBottom: 5 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          padding: 3,
          boxShadow: 3,
          borderRadius: 4,
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* ✅ Left Side: Product Image */}
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            width: { xs: "100%", md: "50%" },
            height: "auto",
            borderRadius: 3,
          }}
        />

        {/* ✅ Right Side: Product Details */}
        <CardContent sx={{ flex: 1, textAlign: "left", paddingX: 4 }}>
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductPage;
