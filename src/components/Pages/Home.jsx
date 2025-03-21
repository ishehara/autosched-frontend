import React from 'react';
import { 

  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  useTheme 
} from '@mui/material';
import { 
  CalendarMonth, 
  People, 
  MeetingRoom, 
  
  SmartToy, 
  ArrowForward,
  Dashboard
} from '@mui/icons-material';

function HomePage() {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
     
      {/* Hero Section */}
      <Box
        sx={{
          pt: 15,
          pb: 10,
          background: `linear-gradient(to right bottom, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                AI-Powered Presentation Scheduling
              </Typography>
              <Typography variant="h5" component="p" paragraph>
                Schedule presentations without conflicts using intelligent automation.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  color="secondary"
                  startIcon={<Dashboard />}
                  sx={{ mr: 2 }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={6} 
                sx={{ 
                  p: 2,
                  borderRadius: 2,
                  height: '350px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center' 
                }}
              >
                <img 
                  src="/api/placeholder/600/350" 
                  alt="Autoshed Dashboard" 
                  style={{ maxWidth: '100%', maxHeight: '100%' }} 
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="h6" component="p" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Streamline your scheduling process with our powerful tools
        </Typography>
        
        <Grid container spacing={4}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  bgcolor: theme.palette.primary.light,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 4,
                }}
              >
                <CalendarMonth sx={{ fontSize: 70, color: '#fff' }} />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  Presentation Scheduling
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  AI-powered conflict resolution ensures optimal scheduling of presentations across multiple examiners and venues.
                </Typography>
                <Button 
                  variant="text" 
                  color="primary" 
                  sx={{ mt: 2 }} 
                  endIcon={<ArrowForward />}
                >
                  Explore Scheduling
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 4,
                }}
              >
                <People sx={{ fontSize: 70, color: '#fff' }} />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  Examiner Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Effortlessly organize examiner availability, expertise, and workload distribution for balanced assignments.
                </Typography>
                <Button 
                  variant="text" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  endIcon={<ArrowForward />}
                >
                  Manage Examiners
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  bgcolor: theme.palette.success.main,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 4,
                }}
              >
                <MeetingRoom sx={{ fontSize: 70, color: '#fff' }} />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  Room & Venue Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage room availability, capacity, and technical requirements to ensure the perfect match for each presentation.
                </Typography>
                <Button 
                  variant="text" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  endIcon={<ArrowForward />}
                >
                  View Venues
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* AI Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <SmartToy sx={{ fontSize: 120, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h3" component="h2" gutterBottom>
                AI-Powered Scheduling
              </Typography>
              <Typography variant="body1" paragraph>
                Our intelligent scheduling algorithm considers multiple constraints to create conflict-free timetables:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonth color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Time constraints and preferences" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <People color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Examiner availability and expertise matching" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MeetingRoom color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Room capacity and equipment requirements" />
                </ListItem>
              </List>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                See How It Works
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper
                }}
              >
                <img 
                  src="/api/placeholder/500/350" 
                  alt="AI Scheduling Demo" 
                  style={{ width: '100%', borderRadius: '4px' }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  AI-powered conflict resolution in action
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.primary.dark, 
          color: 'white', 
          py: 8, 
          textAlign: 'center' 
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Optimize Your Scheduling?
          </Typography>
          <Typography variant="h6" paragraph>
            Join educational institutions and organizations that have eliminated scheduling conflicts
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            sx={{ mt: 3 }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Autoshed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered presentation scheduling without conflicts
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2" component="a" href="#" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>
                Features
              </Typography>
              <Typography variant="body2" component="a" href="#" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>
                How It Works
              </Typography>
              <Typography variant="body2" component="a" href="#" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>
                Support
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Email: contact@autoshed.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Autoshed. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;