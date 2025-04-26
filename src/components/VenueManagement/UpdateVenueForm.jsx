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
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

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
          capacity: parseInt(venueData.capacity), // 🔥 Correctly send capacity as number
          availability: venueData.availability,
          "Time Slot": venueData["Time Slot"],
          organizer_email: venueData.organizer_email,
          available_facilities: venueData.available_facilities
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      alert('Venue updated successfully!');
      navigate('/VenueList'); // Redirect to VenueList
    } catch (err) {
      console.error('Error updating venue:', err.response ? err.response.data : err.message);
      alert('Failed to update venue.');
    }
  };

  if (loading || !venueData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Update Venue
      </Typography>
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Room Type"
              name="room_type"
              fullWidth
              value={venueData.room_type}
              onChange={handleChange}
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
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
          <Grid item xs={12} sm={6}>
            <TextField
              label="Time Slot"
              name="Time Slot"
              type="time"
              fullWidth
              required
              value={venueData["Time Slot"]}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Organizer Email"
              name="organizer_email"
              type="email"
              fullWidth
              required
              value={venueData.organizer_email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Available Facilities</InputLabel>
              <Select
                multiple
                name="available_facilities"
                value={venueData.available_facilities}
                onChange={handleFacilitiesChange}
                input={<OutlinedInput label="Available Facilities" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
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

          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button type="submit" variant="contained" color="primary" size="large">
              Update Venue
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UpdateVenueForm;
