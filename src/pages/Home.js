import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import VR from "../assets/images/VR.jpeg";
const Home = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full viewport height
        textAlign: "center",
        paddingTop: 8,
      }}
    >
      {/* ✅ Hero Section */}
      <Typography variant="h2" sx={{ fontWeight: "bold", color: "#1D1D1F" }}>
        Welcome to Tech Gadgets Store
      </Typography>
      <Typography
        variant="h5"
        sx={{ color: "#6E6E73", marginTop: 2, maxWidth: "600px" }}
      >
        Discover the latest Apple products at unbeatable prices. Upgrade your
        tech today!
      </Typography>

      {/* ✅ CTA Buttons */}
      <Box sx={{ marginTop: 4 }}>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          sx={{
            backgroundColor: "#0071E3",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            paddingX: 4,
            paddingY: 1.5,
            borderRadius: "8px",
            ":hover": { backgroundColor: "#005BB5" },
          }}
        >
          Shop Now
        </Button>
      </Box>

      {/* ✅ Hero Image */}
      <Box
        component="img"
        src={VR} // Replace with actual Apple-like banner
        alt="Tech Gadgets Store"
        sx={{
          width: "100%",
          maxWidth: "800px",
          marginTop: 5,
          borderRadius: "12px",
          boxShadow: 3,
        }}
      />
    </Container>
  );
};

export default Home;
