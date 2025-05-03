import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';


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


  const generateVenueReport = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'Venue Statistics Report',
      author: 'Venue Management System',
      creator: 'Venue Dashboard'
    });
    
    // Helper function to add a horizontal line
    const addHorizontalLine = (y, lineWidth = 0.5) => {
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(lineWidth);
      doc.line(14, y, 196, y);
    };
    
    // Helper function for section titles
    const addSectionTitle = (text, y) => {
      doc.setFillColor(70, 130, 180); // Steel blue
      doc.rect(14, y - 6, 182, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(text, 17, y);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      return y + 10;
    };
    
    // Helper function to add stat with label and value
    const addStat = (label, value, y, icon = null) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(label + ':', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value.toString(), 80, y);
      return y + 8;
    };
    
    // Create header
    doc.setFillColor(41, 128, 185); // Blue header
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('VENUE MANAGEMENT SYSTEM', 105, 15, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Statistics Report', 105, 24, { align: 'center' });
    
    // Add report date
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'italic');
    const today = new Date();
    doc.text(`Generated on: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`, 
      14, 40);
    
    // Add horizontal line
    addHorizontalLine(45);
    
    // Summary Section
    let yPos = addSectionTitle('VENUE SUMMARY', 55);
    
    // Add key statistics in 2x2 grid format with borders
    const boxWidth = 85;
    const boxHeight = 25;
  
    // Top row boxes
    // Box 1: Total Venues
    doc.setDrawColor(70, 130, 180);
    doc.setLineWidth(0.5);
    doc.rect(14, yPos, boxWidth, boxHeight);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL VENUES', 20, yPos + 7);
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 185);
    doc.text(stats.totalVenues.toString(), 20, yPos + 20);
    doc.setTextColor(0, 0, 0);
    
    // Box 2: Available Venues
    doc.setDrawColor(46, 204, 113);
    doc.rect(14 + boxWidth + 10, yPos, boxWidth, boxHeight);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('AVAILABLE VENUES', 14 + boxWidth + 16, yPos + 7);
    doc.setFontSize(18);
    doc.setTextColor(46, 204, 113);
    doc.text(stats.availableVenues.toString(), 14 + boxWidth + 16, yPos + 20);
    doc.setTextColor(0, 0, 0);
    
    // Bottom row boxes
    yPos += boxHeight + 5;
    
    // Box 3: Total Capacity
    doc.setDrawColor(241, 196, 15);
    doc.rect(14, yPos, boxWidth, boxHeight);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL CAPACITY', 20, yPos + 7);
    doc.setFontSize(18);
    doc.setTextColor(241, 196, 15);
    doc.text(stats.totalCapacity.toString(), 20, yPos + 20);
    doc.setTextColor(0, 0, 0);
    
    // Box 4: Average Capacity
    doc.setDrawColor(155, 89, 182);
    doc.rect(14 + boxWidth + 10, yPos, boxWidth, boxHeight);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('AVERAGE CAPACITY', 14 + boxWidth + 16, yPos + 7);
    doc.setFontSize(18);
    doc.setTextColor(155, 89, 182);
    const avgCapacity = Math.round(stats.totalCapacity / (stats.totalVenues || 1));
    doc.text(avgCapacity.toString(), 14 + boxWidth + 16, yPos + 20);
    doc.setTextColor(0, 0, 0);
    
    yPos += boxHeight + 15;
    
    // Availability percentage with simple chart
    yPos = addSectionTitle('AVAILABILITY BREAKDOWN', yPos);
    
    const availabilityPercentage = Math.round((stats.availableVenues / stats.totalVenues) * 100);
    const unavailablePercentage = 100 - availabilityPercentage;
    
    doc.setFontSize(11);
    doc.text('Availability Status:', 20, yPos + 5);
    
    // Draw availability bar chart
    const barWidth = 150;
    const barHeight = 15;
    const availWidth = (availabilityPercentage / 100) * barWidth;
    
    // Available bar (green)
    doc.setFillColor(46, 204, 113);
    doc.rect(40, yPos + 10, availWidth, barHeight, 'F');
    
    // Unavailable bar (gray)
    doc.setFillColor(189, 195, 199);
    doc.rect(40 + availWidth, yPos + 10, barWidth - availWidth, barHeight, 'F');
    
    // Labels
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Available: ${availabilityPercentage}%`, 40 + (availWidth/2), yPos + 20, { align: 'center' });
    doc.text(`Unavailable: ${unavailablePercentage}%`, 40 + availWidth + ((barWidth - availWidth)/2), yPos + 20, { align: 'center' });
    
    yPos += 30;
    
    // Location Analysis Section
    yPos = addSectionTitle('LOCATION ANALYSIS', yPos);
    
    const locationEntries = Object.entries(stats.locations);
    if (locationEntries.length > 0) {
      doc.setFontSize(11);
      doc.text('Distribution of venues by location:', 20, yPos + 5);
      
      yPos += 10;
      
      // Create a table header for locations
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos, 100, 8, 'F');
      doc.rect(120, yPos, 30, 8, 'F');
      doc.rect(150, yPos, 40, 8, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Location', 25, yPos + 6);
      doc.text('Count', 125, yPos + 6);
      doc.text('Percentage', 155, yPos + 6);
      
      yPos += 8;
      
      // Add location data rows
      locationEntries.forEach(([location, count], index) => {
        const rowY = yPos + (index * 8);
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(20, rowY, 170, 8, 'F');
        }
        
        doc.setFont('helvetica', 'normal');
        doc.text(location, 25, rowY + 6);
        doc.text(count.toString(), 125, rowY + 6);
        
        const percentage = Math.round((count / stats.totalVenues) * 100);
        doc.text(`${percentage}%`, 155, rowY + 6);
      });
      
      yPos += (locationEntries.length * 8) + 10;
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an automatically generated report from the Venue Management System.', 105, 285, { align: 'center' });
    doc.text('For questions or support, please contact the system administrator.', 105, 290, { align: 'center' });
    
    // Save the PDF
    doc.save('venue_statistics_report.pdf');
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

        <Button
  variant="outlined"
  color="secondary"
  startIcon={<InfoIcon />}
  size="large"
  onClick={generateVenueReport}
  sx={{ 
    borderRadius: 2, 
    fontWeight: 'bold',
    px: 3,
    py: 1,
    boxShadow: 1,
    ml: 2,
    '&:hover': {
      boxShadow: 3,
      backgroundColor: theme.palette.secondary.light
    }
  }}
>
  Download Report
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