import React, { useContext, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Products = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const favorites = useSelector((state) => state.favorites);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const isFavorite = (productId) =>
    favorites && favorites.some((item) => item?.id === productId);

  const handleToggleFavorite = (product) => {
    if (!user || !user.email) {
      setDialogOpen(true);
      return;
    }
    dispatch(toggleFavorite({ userEmail: user.email, product }));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: { xs: 2, sm: 3, md: 5 },
        textAlign: "center",
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1D1D1F",
          marginBottom: 4,
        }}
      >
        Apple Products
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          alignContent: "flex-start",
          overflowY: { xs: "scroll", md: "visible" },
          height: { xs: "calc(100vh - 200px)", md: "auto" },
        }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            sx={{
              width: { xs: "280px", sm: "300px", md: "350px" },
              boxShadow: 4,
              borderRadius: 6,
              overflow: "hidden",
              position: "relative",
              transition: "transform 0.3s ease",
              ":hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
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
                  height: { xs: 180, sm: 220, md: 250 },
                  objectFit: "contain",
                  backgroundColor: "#F9F9F9",
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
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#0066CC" }}
              >
                ${product.price}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog for Sign-In Prompt */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "red",
          }}
        >
          Profile Required
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", marginBottom: 2 }}>
          <Typography variant="body1" sx={{ color: "#6E6E73" }}>
            Please sign in to add items to your favorites.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleDialogClose}
            sx={{
              backgroundColor: "#E4E4E6",
              color: "#1D1D1F",
              ":hover": { backgroundColor: "#D1D1D6" },
              paddingX: 4,
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => navigate("/signin")}
            sx={{
              backgroundColor: "#1d1d1f",
              color: "#fff",
              ":hover": { backgroundColor: "#000" },
              paddingX: 4,
              borderRadius: 2,
            }}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products;
