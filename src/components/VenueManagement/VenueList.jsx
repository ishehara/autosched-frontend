import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  MeetingRoom,
  Search,
  Refresh,
  Delete,
  Edit,
  InfoOutlined,
  EventSeat,
  LocationOn,
  Timer,
  Email,
  Category,
  FilterList,
  VisibilityOutlined,
  BarChart,
  Assessment,
  Add
} from "@mui/icons-material";

const VenueList = ({ onEdit, refreshTrigger, onAddVenue }) => {
  // State for venue data and UI
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [filterAvailability, setFilterAvailability] = useState("All");
  const [showStats, setShowStats] = useState(true);
  const [venueStats, setVenueStats] = useState({
    roomTypes: {},
    availabilityStatus: {},
    totalCapacity: 0,
    totalVenues: 0
  });

  // Dummy data for venues
  const dummyVenues = [
    {
      id: 1,
      venueName: "G403",
      roomType: "Conference Hall",
      capacity: 180,
      location: "New Building, Floor 4",
      availability: "Available",
      timeSlot: "09:00",
      organizerEmail: "samarasinghe@company.com",
      facilities: ["Projector", "Sound System", "AC", "Mic"],
    },
    {
      id: 2,
      venueName: "A405",
      roomType: "Meeting Room",
      capacity: 25,
      location: "Main Building, Floor 4",
      availability: "Reserved",
      timeSlot: "13:30",
      organizerEmail: "Silva@company.com",
      facilities: ["Whiteboard", "AC", "Projector"],
    },
    {
      id: 3,
      venueName: "A603",
      roomType: "PC Lab",
      capacity: 40,
      location: "Main Building, Floor 6",
      availability: "Available",
      timeSlot: "10:00",
      organizerEmail: "silva@company.com",
      facilities: ["Projector", "Whiteboard", "Sound System"],
    },
    {
      id: 4,
      venueName: "Main Auditorium",
      roomType: "Auditorium",
      capacity: 350,
      location: "Auditorium",
      availability: "Under Maintenance",
      timeSlot: "08:00",
      organizerEmail: "silva@company.com",
      facilities: ["Sound System", "AC", "Mic"],
    },
    {
      id: 5,
      venueName: "F1305",
      roomType: "Laboratory",
      capacity: 30,
      location: "New Building, Floor 13",
      availability: "Available",
      timeSlot: "14:00",
      organizerEmail: "samarasinghe@company.com",
      facilities: ["Whiteboard", "AC"],
    },
    {
      id: 6,
      venueName: "F505",
      roomType: "Multimedia Room",
      capacity: 45,
      location: "New Building, Floor 5",
      availability: "Reserved",
      timeSlot: "11:30",
      organizerEmail: "samarasinghe@company.com",
      facilities: ["Projector", "Sound System", "AC", "Mic"],
    },
    {
      id: 7,
      venueName: "B512",
      roomType: "Seminar Room",
      capacity: 50,
      location: "Main Building, Floor 5",
      availability: "Available",
      timeSlot: "15:00",
      organizerEmail: "silva@company.com",
      facilities: ["Projector", "Whiteboard", "AC"],
    },
  ];

  // Calculate venue statistics
  const calculateStats = (venueData) => {
    const stats = {
      roomTypes: {},
      availabilityStatus: {},
      totalCapacity: 0,
      totalVenues: venueData.length,
      facilitiesCount: {}
    };

    venueData.forEach(venue => {
      // Count room types
      stats.roomTypes[venue.roomType] = (stats.roomTypes[venue.roomType] || 0) + 1;
      
      // Count availability status
      stats.availabilityStatus[venue.availability] = (stats.availabilityStatus[venue.availability] || 0) + 1;
      
      // Sum total capacity
      stats.totalCapacity += venue.capacity;
      
      // Count facilities
      venue.facilities.forEach(facility => {
        stats.facilitiesCount[facility] = (stats.facilitiesCount[facility] || 0) + 1;
      });
    });

    return stats;
  };

  // Fetch venues from the server
  const fetchVenues = async () => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // const response = await axios.get("http://localhost:5000/api/venues");
      // setVenues(response.data);
      
      // Using dummy data instead
      setTimeout(() => {
        setVenues(dummyVenues);
        // Calculate statistics after venues are loaded
        setVenueStats(calculateStats(dummyVenues));
        setLoading(false);
      }, 800); // Simulate network delay
    } catch (err) {
      setError("Failed to fetch venues. Please try again later.");
      setLoading(false);
    }
  };

  // Load venues when component mounts or refreshTrigger changes
  useEffect(() => {
    fetchVenues();
  }, [refreshTrigger]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (venue) => {
    setVenueToDelete(venue);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteCancel = () => {
    setVenueToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Execute venue deletion
  const handleDeleteConfirm = async () => {
    try {
      // In a real application, this would be an API call
      // await axios.delete(`http://localhost:5000/api/venues/${venueToDelete.id}`);
      
      // Simulate deletion
      const updatedVenues = venues.filter(venue => venue.id !== venueToDelete.id);
      setVenues(updatedVenues);
      // Update statistics after deletion
      setVenueStats(calculateStats(updatedVenues));
      setDeleteSuccess(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 5000);
    } catch (err) {
      setError("Failed to delete venue. Please try again later.");
    } finally {
      setDeleteDialogOpen(false);
      setVenueToDelete(null);
    }
  };

  // View venue details
  const handleViewDetails = (venue) => {
    setSelectedVenue(venue);
    setDetailDialogOpen(true);
  };

  // Close detail dialog
  const handleCloseDetails = () => {
    setDetailDialogOpen(false);
    setSelectedVenue(null);
  };

  // Get status chip color based on availability
  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return { color: "success", text: "Available" };
      case "Reserved":
        return { color: "warning", text: "Reserved" };
      case "Under Maintenance":
        return { color: "error", text: "Maintenance" };
      default:
        return { color: "default", text: status };
    }
  };

  // Filter venues based on search term and availability filter
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = 
      venue.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.organizerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterAvailability === "All" || venue.availability === filterAvailability;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate displayed rows
  const displayedVenues = filteredVenues
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Toggle statistics view
  const toggleStats = () => {
    setShowStats(!showStats);
  };

  return (
    <Paper elevation={6} sx={{ 
      maxWidth: 1200, 
      margin: "auto", 
      mt: 5, 
      mb: 5,
      borderRadius: 3,
      overflow: "hidden",
      transition: "all 0.3s ease-in-out",
      '&:hover': {
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      }
    }}>

      
      <Box sx={{ 
        p: 3, 
        background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
        color: "white",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <MeetingRoom sx={{ mr: 1.5, fontSize: 35 }} />
            Venue List
          </Typography>
          <Typography variant="subtitle1">
            Manage your venues and rooms
          </Typography>
        </Box>
        <Button
        component={Link} to="/addVenue"
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<Add />}
          onClick={onAddVenue}
          sx={{
            fontWeight: 'bold',
            px: 3,
            py: 1.2,
            backgroundColor: 'white',
            color: '#3f51b5',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            }
          }}
        >
          Add Venue
        </Button>
      </Box>

      {/* Collapse success message */}
      <Collapse in={deleteSuccess}>
        <Alert 
          severity="success"
          sx={{ m: 2 }}
          onClose={() => setDeleteSuccess(false)}
        >
          Venue deleted successfully!
        </Alert>
      </Collapse>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Section */}
      <Collapse in={showStats}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Assessment sx={{ mr: 1 }} />
                      Venue Statistics
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={toggleStats}
                    >
                      Hide Stats
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    {/* Total Statistics */}
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined" sx={{ bgcolor: 'primary.light', color: 'white' }}>
                        <CardContent>
                          <Typography variant="subtitle2">Total Venues</Typography>
                          <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1 }}>
                            {venueStats.totalVenues}
                          </Typography>
                          <Typography variant="body2">
                            Total Capacity: {venueStats.totalCapacity} people
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Room Types */}
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Typography variant="subtitle2" color="textSecondary">Room Types</Typography>
                          {Object.entries(venueStats.roomTypes).map(([type, count]) => (
                            <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="body2">{type}</Typography>
                              <Typography variant="body2" fontWeight="bold">{count}</Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Availability Status */}
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Typography variant="subtitle2" color="textSecondary">Availability Status</Typography>
                          {Object.entries(venueStats.availabilityStatus).map(([status, count]) => (
                            <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                              <Chip 
                                label={status} 
                                size="small" 
                                color={getStatusColor(status).color} 
                                sx={{ minWidth: 120 }}
                              />
                              <Typography variant="body2" fontWeight="bold">{count}</Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {/* Search and filter controls */}
      <Box sx={{ p: 3, pb: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name, type, location or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={8} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by Availability</InputLabel>
              <Select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                label="Filter by Availability"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="All">All Venues</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Reserved">Reserved</MenuItem>
                <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5} md={2}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<Refresh />}
              onClick={fetchVenues}
            >
              Refresh
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            {!showStats && (
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<BarChart />}
                onClick={toggleStats}
              >
                Show Stats
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Venues table */}
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredVenues.length > 0 ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Venue Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Room Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Time Slot</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Organizer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Facilities</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedVenues.map((venue) => {
                  const status = getStatusColor(venue.availability);
                  return (
                    <TableRow 
                      key={venue.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(63, 81, 181, 0.08)',
                        }
                      }}
                    >
                      <TableCell>{venue.venueName}</TableCell>
                      <TableCell>{venue.roomType}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EventSeat fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          {venue.capacity}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          {venue.location}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={status.text} 
                          size="small" 
                          color={status.color} 
                          sx={{ 
                            minWidth: 100,
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Timer fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          {venue.timeSlot}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          {venue.organizerEmail}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {venue.facilities.slice(0, 2).map(facility => (
                            <Chip
                              key={facility}
                              label={facility}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                          {venue.facilities.length > 2 && (
                            <Tooltip title={venue.facilities.slice(2).join(', ')}>
                              <Chip
                                label={`+${venue.facilities.length - 2}`}
                                size="small"
                                color="primary"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleViewDetails(venue)}
                              size="small"
                            >
                              <VisibilityOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Venue">
                            <IconButton 
                              color="primary" 
                              onClick={() => onEdit(venue)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Venue">
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteClick(venue)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredVenues.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        ) : (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              No venues found matching your criteria.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Try adjusting your search or filters.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the venue "{venueToDelete?.venueName}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Venue Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedVenue && (
          <>
            <DialogTitle sx={{ 
              background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
              color: "white",
              display: 'flex',
              alignItems: 'center'
            }}>
              <MeetingRoom sx={{ mr: 1.5 }} />
              {selectedVenue.venueName}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Category sx={{ mr: 1 }} />
                        Basic Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="subtitle2" color="textSecondary">Room Type</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>{selectedVenue.roomType}</Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary">Capacity</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EventSeat fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          {selectedVenue.capacity} people
                        </Box>
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          {selectedVenue.location}
                        </Box>
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary">Organizer Email</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          {selectedVenue.organizerEmail}
                        </Box>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <InfoOutlined sx={{ mr: 1 }} />
                        Availability & Features
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="subtitle2" color="textSecondary">Availability Status</Typography>
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={getStatusColor(selectedVenue.availability).text} 
                          size="small" 
                          color={getStatusColor(selectedVenue.availability).color} 
                          sx={{ mt: 0.5, fontWeight: 'medium' }}
                        />
                      </Box>
                      
                      <Typography variant="subtitle2" color="textSecondary">Time Slot</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Timer fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          {selectedVenue.timeSlot}
                        </Box>
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary">Available Facilities</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {selectedVenue.facilities.length > 0 ? (
                          selectedVenue.facilities.map(facility => (
                            <Chip 
                              key={facility} 
                              label={facility} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                              sx={{ margin: 0.5 }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">No facilities available</Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => onEdit(selectedVenue)} 
                color="primary"
                startIcon={<Edit />}
              >
                Edit Venue
              </Button>
              <Button 
                onClick={handleCloseDetails} 
                variant="contained"
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

// Define PropTypes
VenueList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.number,
  onAddVenue: PropTypes.func.isRequired
};

export default VenueList;