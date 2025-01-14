import React, { useContext } from "react";
import products from "../data/products";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Products = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext); // ✅ Get user data
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!user) {
      toast.warning("You need to sign in to add products to the cart!");
      navigate("/signin");
      return;
    }
    dispatch(addToCart({ userEmail: user.email, product })); // ✅ Add product to cart if logged in
    toast.success(`${product.name} added to cart!`);
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
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 4,
                overflow: "hidden",
                transition: "transform 0.2s",
                ":hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <Link
                to={`/product/${product.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    objectFit: "cover",
                  }}
                />
              </Link>
              <CardContent sx={{ padding: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#1D1D1F" }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 2, color: "#6E6E73" }}
                >
                  {product.description}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#0071E3" }}
                >
                  ${product.price}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#0071E3",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: 3,
                    paddingY: 1.5,
                    marginTop: 2,
                    ":hover": {
                      backgroundColor: "#005BB5",
                    },
                  }}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
