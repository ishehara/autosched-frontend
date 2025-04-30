import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const facilitiesOptions = [
  'Projector',
  'Whiteboard',
  'AC',
  'Sound System',
  'WiFi'
];

const UpdateVenueForm = () => {
  const { venueId } = useParams();  // Get venue ID from URL
  const navigate = useNavigate();
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Fetch venue details by ID when page loads
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/venues/${venueId}`);
        setVenueData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching venue:', err);
        setLoading(false);
        setAlertMessage('Failed to load venue information');
        setAlertSeverity('error');
        setOpenAlert(true);
      }
    };
    fetchVenue();
  }, [venueId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFacilitiesChange = (e) => {
    const {
      target: { value }
    } = e;
    setVenueData((prev) => ({
      ...prev,
      available_facilities: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/venues/${venueId}`,
        {
          venue_name: venueData.venue_name,
          room_type: venueData.room_type,
          location: venueData.location,
          capacity: parseInt(venueData.capacity),
          availability: venueData.availability,
          organizer_email: venueData.organizer_email,
          available_facilities: venueData.available_facilities
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      setAlertMessage('Venue updated successfully!');
      setAlertSeverity('success');
      setOpenAlert(true);
      
      // Navigate after showing the alert
      setTimeout(() => {
        navigate('/VenueList');
      }, 2000);
    } catch (err) {
      console.error('Error updating venue:', err.response ? err.response.data : err.message);
      setAlertMessage('Failed to update venue. Please try again.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  if (loading || !venueData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Update Venue
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Venue Name"
                name="venue_name"
                fullWidth
                required
                value={venueData.venue_name}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Room Type"
                name="room_type"
                fullWidth
                value={venueData.room_type}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                fullWidth
                required
                value={venueData.location}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                fullWidth
                required
                value={venueData.capacity}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Availability</InputLabel>
                <Select
                  name="availability"
                  value={venueData.availability}
                  onChange={handleChange}
                  label="Availability"
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Not Available">Not Available</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Organizer Email"
                name="organizer_email"
                type="email"
                fullWidth
                required
                value={venueData.organizer_email}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Available Facilities</InputLabel>
                <Select
                  multiple
                  name="available_facilities"
                  value={venueData.available_facilities || []}
                  onChange={handleFacilitiesChange}
                  input={<OutlinedInput label="Available Facilities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} sx={{ bgcolor: '#e3f2fd' }} />
                      ))}
                    </Box>
                  )}
                >
                  {facilitiesOptions.map((facility) => (
                    <MenuItem key={facility} value={facility}>
                      {facility}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                  }
                }}
              >
                Update Venue
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Enhanced eye-catching alert */}
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={alertSeverity}
          variant="filled"
          sx={{ 
            width: '100%', 
            fontSize: '1.1rem',
            boxShadow: 6,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseAlert}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateVenueForm;