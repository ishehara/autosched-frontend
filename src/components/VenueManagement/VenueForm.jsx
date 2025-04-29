import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
  Paper,
  Snackbar,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/Email';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

const facilitiesOptions = [
  'Projector',
  'Whiteboard',
  'AC',
  'Sound System',
  'Mic',
  'WiFi'
];

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  overflow: 'visible'
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

// Validation schema using Yup
const validationSchema = yup.object({
  venue_name: yup
    .string()
    .required('Venue name is required')
    .min(3, 'Venue name should be at least 3 characters'),
  room_type: yup
    .string()
    .required('Room type is required'),
  location: yup
    .string()
    .required('Location is required')
    .min(5, 'Please provide a more detailed location'),
  capacity: yup
    .number()
    .required('Capacity is required')
    .positive('Capacity must be a positive number')
    .integer('Capacity must be a whole number')
    .typeError('Capacity must be a number'),
  organizer_email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  availability: yup
    .string()
    .required('Availability status is required')
});

const AddVenueForm = () => {
  const navigate = useNavigate();
  
  const [venueData, setVenueData] = useState({
    venue_name: '',
    room_type: '',
    location: '',
    capacity: '',
    availability: '',
    organizer_email: '',
    available_facilities: []
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Enter Venue Details', 'Review & Submit'];

  // Validate form when data changes
  useEffect(() => {
    validateForm();
  }, [venueData, touched]);

  // Calculate form completion percentage
  const calculateCompletion = () => {
    const requiredFields = ['venue_name', 'location', 'capacity', 'organizer_email', 'room_type', 'availability'];
    const filledFields = requiredFields.filter(field => {
      return venueData[field] && venueData[field].toString().trim() !== '';
    });
    return (filledFields.length / requiredFields.length) * 100;
  };

  const completionPercentage = calculateCompletion();

  // Validate form fields
  const validateForm = async () => {
    try {
      await validationSchema.validate(venueData, { abortEarly: false });
      setErrors({});
      setIsFormValid(true);
    } catch (yupError) {
      if (yupError.inner) {
        const validationErrors = {};
        yupError.inner.forEach(error => {
          if (touched[error.path]) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      setIsFormValid(Object.keys(errors).length === 0 && completionPercentage === 100);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleFacilityCheckboxChange = (facility) => {
    setVenueData((prev) => {
      const currentFacilities = [...prev.available_facilities];
      const facilityIndex = currentFacilities.indexOf(facility);
      
      if (facilityIndex === -1) {
        currentFacilities.push(facility);
      } else {
        currentFacilities.splice(facilityIndex, 1);
      }
      
      return {
        ...prev,
        available_facilities: currentFacilities
      };
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
    
    // If we were in the process of redirecting, complete the navigation
    if (isRedirecting) {
      navigate('/VenueList');
    }
  };

  const handleContinueToReview = async (e) => {
    e.preventDefault();
    
    // Touch all fields
    const allTouched = {};
    Object.keys(venueData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validate all fields
    try {
      await validationSchema.validate(venueData, { abortEarly: false });
      setErrors({});
      // Go to review step
      setActiveStep(1);
    } catch (yupError) {
      if (yupError.inner) {
        const validationErrors = {};
        yupError.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        setSnackbar({
          open: true,
          message: 'Please fix the errors before continuing',
          severity: 'error'
        });
      }
    }
  };

  const handleBackToForm = () => {
    setActiveStep(0);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/venues/', venueData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSnackbar({
        open: true,
        message: 'Venue added successfully! Redirecting to Venue List...',
        severity: 'success'
      });
      
      // Reset form data
      setVenueData({
        venue_name: '',
        room_type: '',
        location: '',
        capacity: '',
        availability: '',
        organizer_email: '',
        available_facilities: []
      });
      
      setActiveStep(0);
      setTouched({});
      
      // Set redirecting flag to true
      setIsRedirecting(true);
      
      // Navigate after a short delay to allow the user to see the success message
      setTimeout(() => {
        navigate('/VenueList');
      }, 2000);
      
    } catch (err) {
      console.error('Error adding venue:', err);
      setSnackbar({
        open: true,
        message: 'Failed to add venue. Please try again.',
        severity: 'error'
      });
    }
  };

  // Review component
  const ReviewContent = () => (
    <Box>
      <Typography variant="h6" color="primary" sx={{ mb: 3 }}>Review Venue Details</Typography>
      
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>
                Venue Name
              </TableCell>
              <TableCell>{venueData.venue_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                Room Type
              </TableCell>
              <TableCell>{venueData.room_type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                Location
              </TableCell>
              <TableCell>{venueData.location}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                Capacity
              </TableCell>
              <TableCell>{venueData.capacity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                Organizer Email
              </TableCell>
              <TableCell>{venueData.organizer_email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                Availability
              </TableCell>
              <TableCell>
                {venueData.availability === 'Available' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleOutlineIcon sx={{ color: 'success.main', mr: 1 }} />
                    Available
                  </Box>
                ) : venueData.availability}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                Available Facilities
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {venueData.available_facilities.length > 0 ? 
                    venueData.available_facilities.map(facility => (
                      <Chip 
                        key={facility} 
                        label={facility} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                      />
                    )) : 
                    <Typography variant="body2" color="text.secondary">No facilities selected</Typography>
                  }
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          onClick={handleBackToForm}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            borderRadius: 2,
            fontWeight: 500
          }}
        >
          Back to Edit
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="primary"
          endIcon={<CheckIcon />}
          sx={{ 
            px: 4, 
            py: 1, 
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s'
            }
          }}
        >
          Submit Venue
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <StyledCard>
        <Box 
          sx={{ 
            p: 2, 
            backgroundColor: '#3f51b5', 
            color: 'white',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <MeetingRoomIcon sx={{ fontSize: 28, mr: 2 }} />
          <Box>
            <Typography variant="h5" fontWeight="500">
              Add New Venue
            </Typography>
            <Typography variant="body2">
              Enter the details of your venue below
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Steps */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {activeStep === 0 && (
            <>
              {/* Form completion */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="primary">
                    Form Completion: {Math.round(completionPercentage)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Please fill in all required fields
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={completionPercentage} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              
              <Box component="form" onSubmit={handleContinueToReview}>
                {/* Basic Information Section */}
                <FormSection>
                  <SectionTitle>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 500 }}>
                      Basic Information
                    </Typography>
                    <Tooltip title="All fields marked with * are required">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  </SectionTitle>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Venue Name"
                        name="venue_name"
                        fullWidth
                        required
                        value={venueData.venue_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.venue_name && errors.venue_name)}
                        helperText={touched.venue_name && errors.venue_name}
                        variant="outlined"
                        placeholder="Enter venue name"
                        InputProps={{ 
                          startAdornment: (
                            <InputAdornment position="start">
                              <MeetingRoomIcon color="primary" fontSize="small" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 1.5 } 
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl 
                        fullWidth 
                        variant="outlined"
                        error={Boolean(touched.room_type && errors.room_type)}
                      >
                        <InputLabel>Room Type</InputLabel>
                        <Select
                          name="room_type"
                          value={venueData.room_type}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Room Type"
                          sx={{ borderRadius: 1.5 }}
                          startAdornment={
                            <InputAdornment position="start" sx={{ ml: 2 }}>
                              <MeetingRoomIcon color="primary" fontSize="small" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="Classroom">Classroom</MenuItem>
                          <MenuItem value="Meeting Room">Meeting Room</MenuItem>
                          <MenuItem value="Auditorium">Auditorium</MenuItem>
                          <MenuItem value="Conference Hall">Conference Hall</MenuItem>
                        </Select>
                        {touched.room_type && errors.room_type && (
                          <FormHelperText error>{errors.room_type}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Organizer Email"
                        name="organizer_email"
                        fullWidth
                        required
                        value={venueData.organizer_email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.organizer_email && errors.organizer_email)}
                        helperText={touched.organizer_email && errors.organizer_email}
                        type="email"
                        variant="outlined"
                        placeholder="example@email.com"
                        InputProps={{ 
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="primary" fontSize="small" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 1.5 } 
                        }}
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
                        onBlur={handleBlur}
                        error={Boolean(touched.capacity && errors.capacity)}
                        helperText={touched.capacity && errors.capacity}
                        variant="outlined"
                        placeholder="Maximum number of people"
                        InputProps={{ 
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventSeatIcon color="primary" fontSize="small" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 1.5 } 
                        }}
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
                        onBlur={handleBlur}
                        error={Boolean(touched.location && errors.location)}
                        helperText={touched.location && errors.location}
                        variant="outlined"
                        placeholder="Building and floor details"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AddLocationIcon color="primary" fontSize="small" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 1.5 }
                        }}
                      />
                    </Grid>
                  </Grid>
                </FormSection>

                {/* Availability & Features */}
                <FormSection>
                  <SectionTitle>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 500 }}>
                      Availability & Features
                    </Typography>
                    <Tooltip title="Information about availability and facilities">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  </SectionTitle>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl 
                        fullWidth 
                        variant="outlined"
                        error={Boolean(touched.availability && errors.availability)}
                      >
                        <InputLabel>Availability</InputLabel>
                        <Select
                          name="availability"
                          value={venueData.availability}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Availability"
                          sx={{ borderRadius: 1.5 }}
                        >
                          <MenuItem value="Available">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CheckCircleOutlineIcon sx={{ color: 'success.main', mr: 1 }} />
                              Available
                            </Box>
                          </MenuItem>
                          <MenuItem value="Maintenance">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <InfoOutlinedIcon sx={{ color: 'warning.main', mr: 1 }} />
                              Maintenance
                            </Box>
                          </MenuItem>
                          <MenuItem value="Not Available">Not Available</MenuItem>
                        </Select>
                        {touched.availability && errors.availability && (
                          <FormHelperText error>{errors.availability}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        Available Facilities
                        <Tooltip title="Select all facilities available at this venue">
                          <IconButton size="small">
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                        <Grid container spacing={1}>
                          {facilitiesOptions.map((facility) => (
                            <Grid item xs={6} sm={4} key={facility}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={venueData.available_facilities.includes(facility)}
                                    onChange={() => handleFacilityCheckboxChange(facility)}
                                    color="primary"
                                  />
                                }
                                label={facility}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </FormSection>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    disabled={!isFormValid && completionPercentage < 100}
                    sx={{ 
                      px: 6, 
                      py: 1.2, 
                      borderRadius: 2,
                      backgroundColor: '#2196f3',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                      '&:hover': {
                        backgroundColor: '#1976d2',
                        boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s'
                      },
                      '&:disabled': {
                        backgroundColor: '#e0e0e0',
                        color: '#a0a0a0'
                      }
                    }}
                  >
                    CONTINUE TO REVIEW
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {activeStep === 1 && <ReviewContent />}
        </CardContent>
      </StyledCard>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddVenueForm;