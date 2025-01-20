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
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";

const SignupSchema = object({
  name: string().required("Name is required"),
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await updateProfile(userCredential.user, { displayName: values.name });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Signup failed. Try again.");
      setErrors({ email: "Failed to create account." });
    }
    setLoading(false);
    setSubmitting(false);
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
            Sign Up
          </Typography>
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, values, errors, touched }) => (
              <Form>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  margin="normal"
                />
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
                    backgroundColor: "#0071E3",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "12px",
                    marginTop: 2,
                    ":hover": { backgroundColor: "#005BB5" },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign Up"}
                </Button>
              </Form>
            )}
          </Formik>
          <Typography align="center" sx={{ marginTop: 2 }}>
            Already have an account? <Link to="/signin">Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
