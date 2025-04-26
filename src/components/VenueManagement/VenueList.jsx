import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
  TableContainer,
  Grid,
  Card,
  CardContent,
  Divider,
  Tooltip,
  useTheme,
  TextField,
  InputAdornment,
  Button,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVenues: 0,
    availableVenues: 0,
    totalCapacity: 0,
    locations: {}
  });
  // State variables for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVenues, setFilteredVenues] = useState([]);
  
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    axios.get('http://localhost:5000/api/venues')
      .then((res) => {
        const venueData = res.data;
        setVenues(venueData);
        setFilteredVenues(venueData); // Initialize filtered venues with all venues
        calculateStats(venueData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching venues:', err);
        setLoading(false);
      });
  }, []);

  // Handle search filtering
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVenues(venues);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const results = venues.filter(venue => 
        venue.venue_name?.toLowerCase().includes(lowercasedTerm) ||
        venue.location?.toLowerCase().includes(lowercasedTerm) ||
        venue.room_type?.toLowerCase().includes(lowercasedTerm) ||
        venue.organizer_email?.toLowerCase().includes(lowercasedTerm) ||
        venue.available_facilities?.some(facility => 
          facility.toLowerCase().includes(lowercasedTerm)
        ) ||
        venue.availability?.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredVenues(results);
    }
  }, [searchTerm, venues]);

  const calculateStats = (venueData) => {
    const newStats = {
      totalVenues: venueData.length,
      availableVenues: venueData.filter(v => v.availability === 'Available').length,
      totalCapacity: venueData.reduce((sum, venue) => sum + (parseInt(venue.capacity) || 0), 0),
      locations: {}
    };

    // Calculate locations
    venueData.forEach(venue => {
      const location = venue.location;
      newStats.locations[location] = (newStats.locations[location] || 0) + 1;
    });

    setStats(newStats);
  };

  // Handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddVenue = () => {
    // Navigate to the add venue page
    navigate('/addVenue');
  };

  const handleUpdateVenue = (venueId) => {
    navigate(`/UpdateVenueForm/${venueId}`);
  };
  

  const handleDeleteVenue = (venueId) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this venue?')) {
      axios.delete(`http://localhost:5000/api/venues/${venueId}`)
        .then(() => {
          // Remove the venue from state after successful deletion
          const updatedVenues = venues.filter(venue => venue._id !== venueId);
          setVenues(updatedVenues);
          setFilteredVenues(updatedVenues);
          calculateStats(updatedVenues);
          alert('Venue deleted successfully!');
        })
        .catch((err) => {
          console.error('Error deleting venue:', err);
          alert('Failed to delete venue. Please try again.');
        });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" fontWeight="bold" color="primary">
          Venue Management Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          size="large"
          onClick={handleAddVenue}
          sx={{ 
            borderRadius: 2, 
            fontWeight: 'bold',
            px: 3,
            py: 1,
            boxShadow: 3,
            '&:hover': {
              boxShadow: 5,
              backgroundColor: theme.palette.primary.dark
            }
          }}
        >
          Add Venue
        </Button>
      </Box>
      <Divider sx={{ mb: 4 }} />

      {/* Stats Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={4} sx={{ height: '100%', borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" color="textSecondary">Total Venues</Typography>
                <MeetingRoomIcon color="primary" fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mt: 2 }}>
                {stats.totalVenues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={4} sx={{ height: '100%', borderRadius: 2, bgcolor: 'rgba(0, 196, 159, 0.08)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" color="textSecondary">Available</Typography>
                <EventAvailableIcon sx={{ color: '#00C49F' }} fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mt: 2, color: '#00C49F' }}>
                {stats.availableVenues}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {Math.round((stats.availableVenues / stats.totalVenues) * 100)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={4} sx={{ height: '100%', borderRadius: 2, bgcolor: 'rgba(0, 136, 254, 0.08)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" color="textSecondary">Total Capacity</Typography>
                <GroupIcon sx={{ color: '#0088FE' }} fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mt: 2, color: '#0088FE' }}>
                {stats.totalCapacity}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Avg: {Math.round(stats.totalCapacity / stats.totalVenues)} per venue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={4} sx={{ height: '100%', borderRadius: 2, bgcolor: 'rgba(255, 128, 66, 0.08)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" color="textSecondary">Locations</Typography>
                <LocationOnIcon sx={{ color: '#FF8042' }} fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mt: 2, color: '#FF8042' }}>
                {Object.keys(stats.locations).length}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Different venue locations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search venues by name, location, type, availability or facilities..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            }
          }}
        />
        {searchTerm && (
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Found {filteredVenues.length} venues matching "{searchTerm}"
            </Typography>
            {filteredVenues.length === 0 && (
              <Typography variant="body2" color="error">
                No venues found. Try another search term.
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Enhanced Table */}
      <Paper elevation={5} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Typography variant="h5" fontWeight="medium">
            Venue List
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Venue Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Room Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Availability</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Time Slot</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Organizer Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Facilities</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVenues.map((venue, index) => (
                <TableRow 
                  key={venue._id} 
                  sx={{ 
                    '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'rgba(0, 136, 254, 0.08)' }
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{venue.venue_name}</Typography>
                  </TableCell>
                  <TableCell>{venue.room_type || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                      {venue.location}
                    </Box>
                  </TableCell>
                  <TableCell>{venue.capacity}</TableCell>
                  <TableCell>
                    <Chip 
                      label={venue.availability || 'Unknown'} 
                      size="small" 
                      color={venue.availability === 'Available' ? 'success' : 'default'}
                      variant={venue.availability === 'Available' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>{venue["Time Slot"] || '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="Send email" arrow>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          textDecoration: 'underline', 
                          cursor: 'pointer',
                          color: theme.palette.primary.main
                        }}
                      >
                        {venue.organizer_email}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(venue.available_facilities || []).map((facility, index) => (
                        <Chip 
                          key={index} 
                          label={facility} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Venue" arrow>
                        <IconButton 
                          size="small"
                          color="primary"
                          onClick={() => handleUpdateVenue(venue._id)}
                          sx={{ 
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Venue" arrow>
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={() => handleDeleteVenue(venue._id)}
                          sx={{ 
                            bgcolor: 'rgba(211, 47, 47, 0.1)',
                            '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default VenueList;