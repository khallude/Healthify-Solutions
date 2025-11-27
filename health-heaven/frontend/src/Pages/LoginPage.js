import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      const response = await axios.post('http://localhost:5000/api/newusers/login', {
        email,
        password,
      });

      const { token, message } = response.data;

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Navigate to dashboard on successful login
      navigate('/dashboard1');
    } catch (error) {
      console.error('Login Error:', error); // Log error details to console
      setError(error.response ? error.response.data.message : 'Error logging in');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 14 }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: '#1976d2',
          textTransform: 'uppercase',
          letterSpacing: 2,
          mb: 2,
        }}
      >
        Healthify Solutions
      </Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
          Log In
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Log In
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Link to="/forgetpassword" className="text-sm text-blue-600">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-sm text-blue-600">
            Create Account
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
