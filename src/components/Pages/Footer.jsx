import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#1976D2',
        color: '#F5F9F7',
        pt: 6,
        pb: 3,
        width: "100%",  // ✅ Fix overflow issue
        overflow: "hidden", // ✅ Prevents horizontal scrolling
        position: "relative",
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <Container maxWidth="none" > {/* ✅ Ensures full-width without overflow */}
        <Grid container spacing={4}>
          {/* Logo and About */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarMonthIcon sx={{ fontSize: 32, mr: 1, color: '#A7D8C9' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>AUTOSHED</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Autoshed is an AI-powered web application for conflict-free presentation scheduling, 
              examiner management, and venue coordination.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: '#A7D8C9' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#A7D8C9' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#A7D8C9' }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#A7D8C9' }}>
                <GitHubIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Features
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/scheduling" underline="hover" sx={{ color: '#A7D8C9' }}>
                  Scheduling
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/examiners" underline="hover" sx={{ color: '#A7D8C9' }}>
                  Examiners
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/venues" underline="hover" sx={{ color: '#A7D8C9' }}>
                  Venues
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/ai" underline="hover" sx={{ color: '#A7D8C9' }}>
                  AI Technology
                </Link>
              </Box>
            </Box>
          </Grid>
          
          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Support
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/help" underline="hover" sx={{ color: '#A7D8C9' }}>
                  Help Center
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/documentation" underline="hover" sx={{ color: '#A7D8C9' }}>
                  Documentation
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/tutorials" underline="hover" sx={{ color: '#A7D8C9' }}>
                  Tutorials
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/contact" underline="hover" sx={{ color: '#A7D8C9' }}>
                  Contact Us
                </Link>
              </Box>
            </Box>
          </Grid>
          
          {/* Contact */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@autoshed.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: +1 (555) 123-4567
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Address: 123 Tech Avenue, Suite 456
              Innovation City, IN 78910
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(167, 216, 201, 0.2)', my: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} Autoshed. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" underline="hover" sx={{ color: '#A7D8C9' }}>
              <Typography variant="body2">
                Privacy Policy
              </Typography>
            </Link>
            <Link href="/terms" underline="hover" sx={{ color: '#A7D8C9' }}>
              <Typography variant="body2">
                Terms of Service
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
