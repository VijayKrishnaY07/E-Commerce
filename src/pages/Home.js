import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import VR from "../assets/images/apple_cover.jpeg";

const Home = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsVideoPlaying(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isVideoPlaying) {
      timer = setTimeout(() => {
        setIsVideoPlaying(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isVideoPlaying]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#F5F5F7",
      }}
    >
      {/* Background Cover Photo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${VR})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      ></Box>

      {isVideoPlaying ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#000", // Black background for the video
          }}
        >
          {/* YouTube Embedded Video */}
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/JzxdUXknGTM?autoplay=1&mute=1&controls=0&rel=0&start=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          ></iframe>
        </Box>
      ) : (
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
            color: "#1D1D1F",
            padding: { xs: 2, md: 4 },
          }}
        >
          {/* Hero Section */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "#1D1D1F",
              textShadow: "0px 4px 6px rgba(0,0,0,0.2)",
            }}
          >
            Welcome to Tech Gadgets Store
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#6E6E73",
              marginTop: 2,
              maxWidth: "600px",
              textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Discover the latest Apple products at unbeatable prices. Upgrade
            your tech today!
          </Typography>

          {/* CTA Buttons */}
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
                textTransform: "uppercase",
                ":hover": { backgroundColor: "#005BB5" },
              }}
            >
              Shop Now
            </Button>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default Home;
