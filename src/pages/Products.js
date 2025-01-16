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
    <Container maxWidth="lg" sx={{ marginTop: 8, paddingBottom: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1D1D1F" }}
      >
        Apple Products
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            sx={{
              width: 300,
              boxShadow: 3,
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Favorite Icon */}
            <IconButton
              onClick={() => handleToggleFavorite(product)}
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
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
                sx={{ height: 200, objectFit: "contain" }}
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
