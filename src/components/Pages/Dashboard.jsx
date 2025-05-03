// Dashboard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Container,
  useTheme,
  Button
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  PeopleAlt as PeopleIcon,
  MeetingRoom as RoomIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  AssessmentOutlined as ReportIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // The #89CFF0 color (baby blue) for background
  const babyBlue = '#89CFF0';
  
  // Function to navigate to report generation page
  const goToReportPage = () => {
    navigate('/reports');
  };
  
  return (
   <Box sx={{ 
  background: `linear-gradient(135deg, ${babyBlue} 0%, #b3e0ff 100%)`,
  minHeight: '100vh',
  width: '100vw',  // Changed to 100vw (100% of viewport width)
  maxWidth: '100%', // Ensures it doesn't exceed screen width
  margin: 0, // Remove any margins
  padding: 0, // Remove any padding
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  pt: 7,
  pb: 2,
  boxSizing: 'border-box' // Ensures padding is included in width calculation
}}>
      <Container maxWidth="lg">
         <Paper elevation={3} sx={{ 
         p: 3, 
         mb: 3, 
         borderRadius: 2,
         background: 'rgba(255, 255, 255, 0.9)',
         backdropFilter: 'blur(10px)'
    }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.dark">
                Welcome to AutoSched
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                AI-Powered Presentation Scheduling Dashboard
              </Typography>
            </Box>
            
          </Box>
        </Paper>
        
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 2, 
              boxShadow: 3,
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: 6
              } 
            }}>
              <CardHeader 
                title="Upcoming Presentations" 
                titleTypographyProps={{ fontWeight: 'bold' }}
                avatar={<EventIcon fontSize="large" color="primary" />}
                sx={{ bgcolor: 'primary.light', color: 'white' }}
              />
              <CardContent>
                <Typography variant="h2" color="primary.main" align="center" fontWeight="bold">
                  24
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Next 7 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 2, 
              boxShadow: 3,
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: 6
              } 
            }}>
              <CardHeader 
                title="Available Examiners" 
                titleTypographyProps={{ fontWeight: 'bold' }}
                avatar={<PeopleIcon fontSize="large" color="primary" />}
                sx={{ bgcolor: 'primary.light', color: 'white' }}
              />
              <CardContent>
                <Typography variant="h2" color="primary.main" align="center" fontWeight="bold">
                  18
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Active faculty members
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 2, 
              boxShadow: 3,
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: 6
              } 
            }}>
              <CardHeader 
                title="Available Rooms" 
                titleTypographyProps={{ fontWeight: 'bold' }}
                avatar={<RoomIcon fontSize="large" color="primary" />}
                sx={{ bgcolor: 'primary.light', color: 'white' }}
              />
              <CardContent>
                <Typography variant="h2" color="primary.main" align="center" fontWeight="bold">
                  12
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Ready for scheduling
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* AI Scheduling Status */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: 3,
                borderLeft: '8px solid',
                borderColor: 'secondary.main',
                background: `linear-gradient(to right, rgba(137, 207, 240, 0.2), white)`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LightbulbIcon color="secondary" sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold">AI Scheduler Status</Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
                Last optimization run: Today at 08:30 AM
              </Typography>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                mt: 1,
                p: 1,
                bgcolor: 'rgba(56, 142, 60, 0.1)', 
                borderRadius: 1
              }}>
                <CheckCircleIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  All scheduling conflicts resolved. 3 schedule optimizations applied to improve examiner availability.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Upcoming Presentations */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 340,
                overflow: 'auto',
                borderRadius: 2,
                boxShadow: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold">Today's Presentations</Typography>
              </Box>
              <List>
                <ListItem sx={{ bgcolor: 'rgba(137, 207, 240, 0.2)', borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="medium">Web Development Final Project</Typography>} 
                    secondary="Room 101 - 09:30 AM - Dr. Martinez" 
                  />
                </ListItem>
                <ListItem sx={{ mb: 1 }}>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="medium">AI and Machine Learning Applications</Typography>} 
                    secondary="Room 205 - 11:00 AM - Dr. Chen" 
                  />
                </ListItem>
                <ListItem sx={{ bgcolor: 'rgba(137, 207, 240, 0.2)', borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="medium">Database Systems Design</Typography>} 
                    secondary="Room 302 - 01:30 PM - Dr. Patel" 
                  />
                </ListItem>
                <ListItem sx={{ mb: 1 }}>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="medium">Cybersecurity Best Practices</Typography>} 
                    secondary="Room 101 - 03:00 PM - Dr. Johnson" 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 340,
                overflow: 'auto',
                borderRadius: 2,
                boxShadow: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
              </Box>
              <List>
                <ListItem sx={{ bgcolor: 'rgba(137, 207, 240, 0.2)', borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="medium">New presentation scheduled</Typography>} 
                    secondary="Mobile Application Development - Room 302 - Mar 22, 2025" 
                  />
                </ListItem>
                <ListItem sx={{ mb: 1 }}>
                  <ListItemIcon>
                    <PeopleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="medium">New examiner added</Typography>} 
                    secondary="Dr. Sarah Johnson - Computer Science Department" 
                  />
                </ListItem>
                <ListItem sx={{ bgcolor: 'rgba(137, 207, 240, 0.2)', borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <LightbulbIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="medium">AI rescheduled 3 presentations</Typography>} 
                    secondary="Conflict detected and resolved automatically" 
                  />
                </ListItem>
                <ListItem sx={{ mb: 1 }}>
                  <ListItemIcon>
                    <RoomIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="medium">Room availability updated</Typography>} 
                    secondary="Room 205 maintenance complete - now available" 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          {/* Schedule Statistics */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: 3
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom component="div">
                Schedule Statistics
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: 'rgba(137, 207, 240, 0.2)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}>
                    <Typography variant="h3" color="primary.main" fontWeight="bold">
                      98%
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Examiner Satisfaction
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: 'rgba(137, 207, 240, 0.2)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' } 
                  }}>
                    <Typography variant="h3" color="primary.main" fontWeight="bold">
                      87%
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Room Utilization
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: 'rgba(56, 142, 60, 0.15)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' } 
                  }}>
                    <Typography variant="h3" color="secondary.main" fontWeight="bold">
                      0
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Scheduling Conflicts
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: 'rgba(137, 207, 240, 0.2)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' } 
                  }}>
                    <Typography variant="h3" color="primary.main" fontWeight="bold">
                      142
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Presentations
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;