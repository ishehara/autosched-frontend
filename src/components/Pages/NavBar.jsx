import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="fixed" sx={{ bgcolor: "primary" }}> {/* ✅ Dark Green Navbar */}
      <Toolbar>
        {/* ✅ Left Section: Logo & Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}> 
          <Box 
            component="img"
            src="LogoImage.jpg"  // ✅ Ensure the logo is in the 'public/' folder
            alt="AutoSched Logo"
            sx={{ height: 55, mr: 1 }} // Reduce margin-right
          />
          <Typography variant="h6" component="div" sx={{ color: "#F5F9F7" }}>
            AutoSched
          </Typography>
        </Box>

        {/* ✅ Right Section: Navigation Links */}
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/presentations">Presentations</Button>
        <Button color="inherit" component={Link} to="/ExaminerForm">Examiners</Button>
        <Button color="inherit" component={Link} to="/VenueList">Venues</Button>

        {/* ✅ Sign In Button */}
        <Button 
          variant="outlined" 
          sx={{ ml: 2, color: "#A7D8C9", borderColor: "#A7D8C9" }} 
          component={Link} 
          to="/login"
        >
          Sign In
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
