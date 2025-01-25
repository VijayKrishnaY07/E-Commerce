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
            backgroundColor: "#000",
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
            justifyContent: "space-between",
            height: "100vh",
            textAlign: "center",
            color: "#000",
            zIndex: 1,
            paddingTop: { xs: 4, md: 8 },
            paddingBottom: { xs: 4, md: 8 },
          }}
        >
          {/* Welcome Text */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: { xs: 8, md: 12 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                marginBottom: 0.1,
                lineHeight: 1.2,
                maxWidth: "800px",
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Welcome to Apple Store
            </Typography>
          </Box>

          {/* Sub Text and Button */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              marginTop: { xs: 2, md: 6 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#000",
                maxWidth: "600px",
                lineHeight: 1.5,
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              }}
            >
              Discover the latest Apple products at unbeatable prices.
            </Typography>

            <Button
              component={Link}
              to="/products"
              variant="contained"
              sx={{
                backgroundColor: "#1d1d1f",
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: { xs: "16px", sm: "18px", md: "20px" },
                paddingX: { xs: 2, sm: 4 },
                paddingY: { xs: 1, sm: 1.5 },
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.4)",
                ":hover": {
                  backgroundColor: "#000",
                },
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
