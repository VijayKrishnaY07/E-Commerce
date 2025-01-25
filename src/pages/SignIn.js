import React, { useState } from "react";
import { Formik, Form } from "formik";
import { object, string } from "yup";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

const SigninSchema = object({
  email: string().email("Invalid email").required("Email is required"),
  password: string().required("Password is required"),
});

const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignin = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Signed in successfully!");
      navigate("/products");
    } catch (error) {
      toast.error("Invalid email or password. Try again.");
      setErrors({ email: "Invalid email or password." });
    }
    setLoading(false);
    setSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google");
      navigate("/");
    } catch (error) {
      toast.error("Google Sign-In failed.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#F0F0F5", // Greyish background
      }}
    >
      <Card
        sx={{
          width: 400,
          padding: 4,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF", // White card
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1D1D1F" }}
          >
            Sign In
          </Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={SigninSchema}
            onSubmit={handleSignin}
          >
            {({ handleChange, handleBlur, values, errors, touched }) => (
              <Form>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  label="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#1d1d1f",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "12px",
                    marginTop: 2,
                    ":hover": {
                      backgroundColor: "#000",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#D1D1D6",
                    color: "#1D1D1F",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "12px",
                    ":hover": {
                      backgroundColor: "#F5F5F7",
                    },
                  }}
                  onClick={handleGoogleSignIn}
                >
                  <Box
                    component="img"
                    src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png"
                    alt="Google Logo"
                    sx={{
                      width: "24px",
                      height: "24px",
                      marginRight: 2,
                    }}
                  />
                  Continue with Google
                </Button>
              </Form>
            )}
          </Formik>
          <Typography align="center" sx={{ marginTop: 2 }}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signin;
