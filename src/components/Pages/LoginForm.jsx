// LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Divider,
  Paper
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddIcon from '@mui/icons-material/Add';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate username
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // If no errors, proceed with the login logic
    if (Object.keys(newErrors).length === 0) {
      alert(`Logging in with\nUsername: ${username}\nPassword: ${password}`);
      // Perform your login action (e.g., API call) here
    } else {
      setErrors(newErrors);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        p: 4
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: '100%',
          maxWidth: 700, // Increased from 550
          borderRadius: 3, // Increased from 2
          overflow: 'hidden',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <Box sx={{ 
          bgcolor: '#2196f3', 
          color: 'white', 
          p: 4, // Increased from 2.5
          display: 'flex',
          alignItems: 'center',
          gap: 1.5 // Increased from 1
        }}>
          <Typography variant="h4" fontWeight="500"> {/* Increased from h5 */}
            Login
          </Typography>
        </Box>

        <CardContent sx={{ p: 5 }}> {/* Increased from 3 */}
          <Typography variant="h5" sx={{ mb: 4, color: '#2196f3', fontWeight: '500' }}> {/* Increased from h6 and mb: 3 */}
            Login Details
          </Typography>
          <Divider sx={{ mb: 4, borderBottomWidth: 2 }} /> {/* Increased from mb: 3 and made divider thicker */}
          
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 4 }} // Increased from gap: 3
          >
            <Box>
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center', color: '#666' }}> {/* Increased from body2 and mb: 0.5 */}
                <PersonIcon sx={{ mr: 1.5, color: '#2196f3', fontSize: 24 }} /> {/* Increased icon size */}
                Username ID
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={Boolean(errors.username)}
                helperText={errors.username}
                size="medium" // Changed from small
                InputProps={{
                  sx: { 
                    borderRadius: 1.5, // Increased from 1
                    fontSize: '1.1rem', // Larger text
                    py: 0.5 // Add more padding vertically
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: errors.username ? 'error.main' : '#d0d0d0',
                      borderWidth: '2px', // Thicker border
                    },
                    '&:hover fieldset': {
                      borderColor: '#2196f3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.9rem', // Larger helper text
                  }
                }}
              />
            </Box>

            <Box>
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center', color: '#666' }}> {/* Increased from body2 and mb: 0.5 */}
                <LockIcon sx={{ mr: 1.5, color: '#2196f3', fontSize: 24 }} /> {/* Increased icon size */}
                Password
              </Typography>
              <TextField
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
                size="medium" // Changed from small
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="medium" // Changed from small
                      >
                        {showPassword ? 
                          <VisibilityOffIcon fontSize="medium" /> : 
                          <VisibilityIcon fontSize="medium" />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { 
                    pr: 0.5, 
                    borderRadius: 1.5, // Increased from 1
                    fontSize: '1.1rem', // Larger text
                    py: 0.5 // Add more padding vertically
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: errors.password ? 'error.main' : '#d0d0d0',
                      borderWidth: '2px', // Thicker border
                    },
                    '&:hover fieldset': {
                      borderColor: '#2196f3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.9rem', // Larger helper text
                  }
                }}
              />
            </Box>

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ 
                mt: 4, // Increased from 3
                bgcolor: '#2196f3', 
                borderRadius: 2, // Increased from 1
                py: 1.8, // Increased from 1.2
                px: 4, // Added horizontal padding
                textTransform: 'none',
                fontWeight: 600, // Increased from 500
                fontSize: '1.2rem', // Larger text
                '&:hover': {
                  bgcolor: '#1976d2',
                },
                display: 'flex',
                gap: 1.5, // Increased from 1
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3 // Added more pronounced shadow
              }}
            >
              
              Login
            </Button>
          </Box>
        </CardContent>
      </Paper>
    </Box>
  );
};

export default LoginForm;