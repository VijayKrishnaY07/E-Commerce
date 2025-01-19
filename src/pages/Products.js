import React, { useContext } from "react";
import products from "../data/products";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoriteSlice";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Products = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const favorites = useSelector((state) => state.favorites);

  const isFavorite = (productId) =>
    favorites && favorites.some((item) => item?.id === productId);

  const handleToggleFavorite = (product) => {
    if (!user || !user.email) {
      alert("Please sign in to add items to favorites.");
      return;
    }
    dispatch(toggleFavorite({ userEmail: user.email, product }));
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full viewport height
        padding: 5,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1D1D1F", marginBottom: 4 }}
      >
        Apple Products
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
        }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            sx={{
              width: 350, // Increased width for larger cards
              boxShadow: 4,
              borderRadius: 6,
              overflow: "hidden",
              position: "relative",
              transition: "transform 0.3s ease", // Add hover effect
              ":hover": {
                transform: "scale(1.05)", // Slight zoom on hover
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover
              },
            }}
          >
            {/* Favorite Icon */}
            <IconButton
              onClick={() => handleToggleFavorite(product)}
              sx={{
                position: "absolute",
                top: 15,
                right: 15,
                backgroundColor: "white",
                ":hover": { backgroundColor: "#F5F5F5" },
              }}
            >
              {isFavorite(product.id) ? (
                <FavoriteIcon sx={{ color: "#FF3B30" }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: "#A1A1A6" }} />
              )}
            </IconButton>

            {/* Link to Product Details */}
            <Link
              to={`/product/${product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{
                  height: 250, // Increased height for larger image
                  objectFit: "contain",
                  backgroundColor: "#F9F9F9", // Light background for image area
                }}
              />
            </Link>

            {/* Product Details */}
            <CardContent sx={{ padding: 3, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginBottom: 2 }}
              >
                {product.description}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ${product.price}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Products;
