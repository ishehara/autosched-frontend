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
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
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
import NumbersIcon from '@mui/icons-material/Numbers';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import EmailIcon from '@mui/icons-material/Email';
import HandymanIcon from '@mui/icons-material/Handyman';
import SettingsIcon from '@mui/icons-material/Settings';

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
  
  // Snackbar state for beautiful alerts
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // State for delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    venueId: null,
    venueName: ''
  });
  
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
  
  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (venueId) => {
    // Find the venue name to show in the dialog
    const venue = venues.find(v => v._id === venueId);
    setDeleteDialog({
      open: true,
      venueId: venueId,
      venueName: venue?.venue_name || 'this venue'
    });
  };
  
  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      ...deleteDialog,
      open: false
    });
  };
  
  // Actually delete the venue after confirmation
  const handleDeleteVenue = () => {
    const venueId = deleteDialog.venueId;
    
    axios.delete(`http://localhost:5000/api/venues/${venueId}`)
      .then(() => {
        // Remove the venue from state after successful deletion
        const updatedVenues = venues.filter(venue => venue._id !== venueId);
        setVenues(updatedVenues);
        setFilteredVenues(updatedVenues);
        calculateStats(updatedVenues);
        
        // Close the dialog
        handleCloseDeleteDialog();
        
        // Show beautiful success message with Snackbar
        setSnackbar({
          open: true,
          message: 'Venue deleted successfully!',
          severity: 'success'
        });
      })
      .catch((err) => {
        console.error('Error deleting venue:', err);
        
        // Close the dialog
        handleCloseDeleteDialog();
        
        // Show beautiful error message with Snackbar
        setSnackbar({
          open: true,
          message: 'Failed to delete venue. Please try again.',
          severity: 'error'
        });
      });
  };
  
  // Handle closing the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  // Custom table header component with icons
  const TableHeaderCell = ({ icon, label }) => (
    <TableCell 
      sx={{ 
        fontWeight: 'bold', 
        bgcolor: '#f5f5f5',
        transition: 'background-color 0.2s',
        '&:hover': { bgcolor: '#e0e0e0' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'bold' }}>
          {label}
        </Typography>
      </Box>
    </TableCell>
  );

  // Define medium-shade background colors for cards
 // Define medium-shade background colors for cards with light patterns
// Define medium-shade background colors for cards with light patterns
const cardStyles = {
  totalVenues: {
    background: 'linear-gradient(135deg,rgb(126, 186, 214) 0%,rgb(157, 191, 207) 100%)',
    textColor: '#ffffff',
    overlay: 'radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0) 100%)'
  },
  availableVenues: {
    background: 'linear-gradient(135deg,rgb(77, 182, 140) 0%,rgb(71, 251, 233) 100%)',
    textColor: '#ffffff',
    accentColor: '#e0f2f1',
    overlay: 'linear-gradient(120deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 70%, rgba(255, 255, 255, 0) 100%)'
  },
  totalCapacity: {
    background: 'linear-gradient(135deg,rgb(117, 131, 215) 0%,rgb(146, 162, 249) 100%)',
    textColor: '#ffffff',
    accentColor: '#e8eaf6',
    overlay: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05) 10px, rgba(255, 255, 255, 0) 10px, rgba(255, 255, 255, 0) 20px)'
  },
  locations: {
    background: 'linear-gradient(135deg,rgb(251, 165, 138) 0%,rgb(236, 178, 160) 100%)',
    textColor: '#ffffff',
    accentColor: '#ffccbc',
    overlay: 'radial-gradient(ellipse at top right, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)'
  }
};
  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 6 }}>
      {/* Snackbar for beautiful notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          elevation={6}
          sx={{ width: '100%', fontSize: '1rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Beautiful Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          elevation: 6,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.error.light, color: 'white', py: 2 }}>
          <Box display="flex" alignItems="center">
            <DeleteIcon sx={{ mr: 1 }} />
            Confirm Deletion
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, minWidth: 400 }}>
          <DialogContentText>
            Are you sure you want to delete <strong>{deleteDialog.venueName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteVenue} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: 2 }}
            autoFocus
          >
            Delete Venue
          </Button>
        </DialogActions>
      </Dialog>
      
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

      {/* Stats Summary Cards with Darker Shade */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={4} 
            sx={{ 
              height: '100%', 
              borderRadius: 2, 
              background: cardStyles.totalVenues.background,
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              } 
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)' }}>Total Venues</Typography>
                <MeetingRoomIcon sx={{ color: 'rgba(255,255,255,0.95)' }} fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mt: 2, color: cardStyles.totalVenues.textColor }}>
                {stats.totalVenues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={4} 
            sx={{ 
              height: '100%', 
              borderRadius: 2, 
              background: cardStyles.availableVenues.background,
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              } 
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)' }}>Available</Typography>
                <EventAvailableIcon sx={{ color: 'rgba(255,255,255,0.95)' }} fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mt: 2, color: '#ffffff' }}>
                {stats.availableVenues}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.85)' }}>
                {Math.round((stats.availableVenues / stats.totalVenues) * 100)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={4} 
            sx={{ 
              height: '100%', 
              borderRadius: 2, 
              background: cardStyles.totalCapacity.background,
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              } 
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)' }}>Total Capacity</Typography>
                <GroupIcon sx={{ color: 'rgba(255,255,255,0.95)' }} fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mt: 2, color: '#ffffff' }}>
                {stats.totalCapacity}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.85)' }}>
                Avg: {Math.round(stats.totalCapacity / stats.totalVenues)} per venue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={4} 
            sx={{ 
              height: '100%', 
              borderRadius: 2, 
              background: cardStyles.locations.background,
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              } 
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)' }}>Locations</Typography>
                <LocationOnIcon sx={{ color: 'rgba(255,255,255,0.95)' }} fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mt: 2, color: '#ffffff' }}>
                {Object.keys(stats.locations).length}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.85)' }}>
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

      {/* Enhanced Table with Icons in Headers */}
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
                <TableHeaderCell 
                  icon={<NumbersIcon fontSize="small" color="primary" />} 
                  label="ID" 
                />
                <TableHeaderCell 
                  icon={<MeetingRoomOutlinedIcon fontSize="small" color="primary" />} 
                  label="Venue Name" 
                />
                <TableHeaderCell 
                  icon={<CategoryIcon fontSize="small" color="primary" />} 
                  label="Room Type" 
                />
                <TableHeaderCell 
                  icon={<LocationOnIcon fontSize="small" color="primary" />} 
                  label="Location" 
                />
                <TableHeaderCell 
                  icon={<GroupIcon fontSize="small" color="primary" />} 
                  label="Capacity" 
                />
                <TableHeaderCell 
                  icon={<EventAvailableIcon fontSize="small" color="primary" />} 
                  label="Availability" 
                />
                <TableHeaderCell 
                  icon={<EmailIcon fontSize="small" color="primary" />} 
                  label="Organizer Email" 
                />
                <TableHeaderCell 
                  icon={<HandymanIcon fontSize="small" color="primary" />} 
                  label="Facilities" 
                />
                <TableHeaderCell 
                  icon={<SettingsIcon fontSize="small" color="primary" />} 
                  label="Actions" 
                />
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
                          onClick={() => handleOpenDeleteDialog(venue._id)}
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