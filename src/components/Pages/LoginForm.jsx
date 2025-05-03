// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Paper,
  Checkbox,
  FormControlLabel,
  Link
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
  // Mock user data
  const mockUsers = [
    { username: 'user1', password: 'password123', name: 'John Doe', role: 'User' },
    { username: 'user2', password: 'password456', name: 'Jane Smith', role: 'Manager' },
    { username: 'admin', password: 'admin123', name: 'Admin User', role: 'Administrator' }
  ];

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
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
      // Check against mock data
      const user = mockUsers.find(
        user => user.username === username && user.password === password
      );
      
      if (user) {
        // Store user in sessionStorage or localStorage (less secure but suitable for demo)
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        // Navigate to dashboard
        navigate('/');
      } else {
        newErrors.general = 'Invalid username or password.';
      }
    }
    
    setErrors(newErrors);
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
        p: 4,
        bgcolor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: '100%',
          maxWidth: 700,
          borderRadius: 3,
          overflow: 'hidden',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <Box sx={{ 
          bgcolor: '#2196f3', 
          color: 'white', 
          p: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Typography variant="h4" fontWeight="500">
            Login
          </Typography>
        </Box>

        <CardContent sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ mb: 4, color: '#2196f3', fontWeight: '500' }}>
            Login Details
          </Typography>
          <Divider sx={{ mb: 4, borderBottomWidth: 2 }} />
          
          {errors.general && (
            <Box sx={{ 
              bgcolor: '#ffebe9', 
              border: '1px solid #ffc1c0', 
              borderRadius: 1, 
              color: '#d32f2f', 
              p: 2, 
              mb: 4 
            }}>
              {errors.general}
            </Box>
          )}
          
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            <Box>
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center', color: '#666' }}>
                <PersonIcon sx={{ mr: 1.5, color: '#2196f3', fontSize: 24 }} />
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
                size="medium"
                InputProps={{
                  sx: { 
                    borderRadius: 1.5,
                    fontSize: '1.1rem',
                    py: 0.5
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: errors.username ? 'error.main' : '#d0d0d0',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#2196f3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.9rem',
                  }
                }}
              />
            </Box>

            <Box>
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center', color: '#666' }}>
                <LockIcon sx={{ mr: 1.5, color: '#2196f3', fontSize: 24 }} />
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
                size="medium"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="medium"
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
                    borderRadius: 1.5,
                    fontSize: '1.1rem',
                    py: 0.5
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: errors.password ? 'error.main' : '#d0d0d0',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#2196f3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.9rem',
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
              />
              <Link href="#" underline="hover" color="primary">
                Forgot password?
              </Link>
            </Box>

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ 
                mt: 4,
                bgcolor: '#2196f3', 
                borderRadius: 2,
                py: 1.8,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.2rem',
                '&:hover': {
                  bgcolor: '#1976d2',
                },
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3
              }}
            >
              Login
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="#" underline="hover" color="primary">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>

        {/* Mock credentials help */}
     
      </Paper>
    </Box>
  );
};

export default LoginPage;