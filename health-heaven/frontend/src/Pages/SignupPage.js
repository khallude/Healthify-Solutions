import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    bloodType: "",
    email: "",
    phone: "",
    address: "",
    allergies: "",
    chronicConditions: "",
    userImage: null, // Updated to match `userImage` field in backend
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, userImage: e.target.files[0] });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    const { fullName, age, email, phone, password, confirmPassword } = formData;
    if (
      !fullName ||
      !age ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      toast.error("All required fields must be filled!");
      return false;
    }

    if (isNaN(age) || age <= 0) {
      toast.error("Age must be a valid number greater than 0!");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email format!");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch(
        "http://localhost:5000/api/newusers/newuser",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Error connecting to the server!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <FavoriteIcon sx={{ width: 30, height: 30, color: "#1976d2", mr: 1 }} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Healthify Solutions
        </Typography>
      </Box>

      {/* Form Section */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Register Your Details
        </Typography>

        {/* Form Fields */}
        <Grid container spacing={2}>
          {[
            {
              label: "Full Name",
              name: "fullName",
              type: "text",
              required: true,
            },
            { label: "Age", name: "age", type: "number", required: true },
            { label: "Blood Type", name: "bloodType", type: "text" },
            { label: "Email", name: "email", type: "email", required: true },
            { label: "Phone", name: "phone", type: "text", required: true },
            { label: "Address", name: "address", type: "text" },
            { label: "Allergies", name: "allergies", type: "text" },
            {
              label: "Chronic Conditions",
              name: "chronicConditions",
              type: "text",
            },
          ].map((field, index) => (
            <Grid item xs={12} md={6} key={index}>
              <TextField
                label={field.label}
                variant="outlined"
                margin="normal"
                fullWidth
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                name={field.name}
                required={field.required}
              />
            </Grid>
          ))}

          {/* Password Fields */}
          {[
            { label: "Password", name: "password" },
            { label: "Confirm Password", name: "confirmPassword" },
          ].map((field, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                label={field.label}
                variant="outlined"
                margin="normal"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={formData[field.name]}
                onChange={handleChange}
                name={field.name}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          ))}

          {/* File Upload */}
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Upload Profile Picture
            </Typography>
            <input
              type="file"
              accept="image/*"
              name="userImage"
              onChange={handleFileChange}
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Sign Up
        </Button>

        {/* Already have an account link */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Link to="/login" className="text-sm text-blue-600 text-align-center">
            Already have an account?
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
