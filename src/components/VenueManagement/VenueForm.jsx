import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  InputAdornment,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  Alert,
  CircularProgress,
  Tooltip,
  Zoom,
  Fade,
  Badge
} from "@mui/material";
import { 
  MeetingRoom, 
  LocationOn, 
  Timer, 
  AddCircleOutline,
  Email,
  Category,
  CheckCircleOutline,
  InfoOutlined,
  EventSeat
} from "@mui/icons-material";

// Validation Schema using Yup
const VenueSchema = Yup.object().shape({
  venueName: Yup.string()
    .min(3, "Venue name must be at least 3 characters")
    .max(50, "Venue name cannot exceed 50 characters")
    .matches(/^[a-zA-Z0-9\s\-_]+$/, "Venue name can only contain letters, numbers, spaces, hyphens and underscores")
    .required("Venue name is required"),
  roomType: Yup.string().required("Room type is required"),
  capacity: Yup.number()
    .typeError("Capacity must be a number")
    .positive("Capacity must be positive")
    .integer("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .max(1000, "Capacity cannot exceed 1000")
    .required("Capacity is required")
    .test(
      'is-appropriate-for-room',
      'Capacity seems unusual for this room type',
      function(value) {
        const roomType = this.parent.roomType;
        if (!roomType || !value) return true;
        
        const recommendations = {
          "Conference Hall": { min: 30, max: 300 },
          "Lecture Hall": { min: 50, max: 400 },
          "Meeting Room": { min: 5, max: 50 },
          "Auditorium": { min: 100, max: 1000 },
          "Seminar Room": { min: 20, max: 100 },
          "Multimedia Room": { min: 10, max: 80 },
          "Laboratory": { min: 10, max: 60 },
          "Training Room": { min: 10, max: 80 }
        };
        
        if (!recommendations[roomType]) return true;
        
        // Warning only, not error (return true to pass validation)
        return true;
      }
    ),
    location: Yup.string()
    .min(5, "Location must be at least 5 characters")
    .max(100, "Location cannot exceed 100 characters")
    .required("Location is required"),
  availability: Yup.string().required("Availability is required"),
  timeSlot: Yup.string()
  .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time slot must be in 24-hour format (HH:MM)")
  .required("Time slot is required")
  .test(
    'is-within-business-hours',
    'Time should be within business hours (08:00-20:00)',
    function(value) {
      if (!value) return true;
      const [hours, minutes] = value.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      return totalMinutes >= 8 * 60 && totalMinutes <= 20 * 60;
    }
  ),
  organizerEmail: Yup.string()
  .email("Invalid email format")
  .required("Organizer email is required")
  .test(
    'is-valid-domain',
    'Use an official email domain',
    function(value) {
      if (!value) return true;
      // Check for common domains that might indicate an official email
      const validDomains = ['.edu', '.gov', '.org', '.com', '.net'];
      return validDomains.some(domain => value.includes(domain));
    }
  ),
});

const VenueForm = ({ fetchVenues }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  
  const roomTypes = [
    "Conference Hall",
    "Lecture Hall",
    "Meeting Room",
    "Auditorium",
    "Seminar Room",
    "Multimedia Room",
    "Laboratory",
    "Training Room"
  ];

  // Updated to two steps instead of three
  const steps = [
    'Enter Venue Details',
    'Review & Submit'
  ];
  
  // Calculate form completion percentage based on filled fields
  const calculateCompletion = (values) => {
    const totalFields = Object.keys(VenueSchema.fields).length;
    const filledFields = Object.keys(values).filter(key => 
      values[key] !== "" && key in VenueSchema.fields
    ).length;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  // Get capacity recommendation based on room type
  const getCapacityRecommendation = (roomType) => {
    const recommendations = {
      "Conference Hall": "50-200",
      "Lecture Hall": "100-300",
      "Meeting Room": "10-30",
      "Auditorium": "200-500",
      "Seminar Room": "30-80",
      "Multimedia Room": "20-50",
      "Laboratory": "20-40",
      "Training Room": "15-50"
    };
    
    return recommendations[roomType] || "No recommendation available";
  };
  
  return (
    <Paper elevation={6} sx={{ 
      maxWidth: 800, 
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
      }}>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <MeetingRoom sx={{ mr: 1.5, fontSize: 35 }} />
          Add New Venue
        </Typography>
        <Typography variant="subtitle1">
          Enter the details of your venue below
        </Typography>
      </Box>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ pt: 4, px: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Collapse in={showSuccess}>
        <Alert 
          severity="success"
          icon={<CheckCircleOutline fontSize="inherit" />}
          sx={{ m: 2 }}
          onClose={() => setShowSuccess(false)}
        >
          Venue added successfully! You can add another venue or view the updated list.
        </Alert>
      </Collapse>
      
      <Collapse in={showValidationAlert}>
        <Alert 
          severity="error"
          sx={{ m: 2 }}
          onClose={() => setShowValidationAlert(false)}
        >
          Please fix the validation errors before proceeding.
        </Alert>
      </Collapse>
      
      <Box sx={{ p: 4 }}>
        <Formik
          initialValues={{
            venueName: "",
            roomType: "",
            capacity: "",
            location: "",
            availability: "",
            timeSlot: "",
            organizerEmail: "",
            facilities: [],
          }}
          validationSchema={VenueSchema}
          onSubmit={async (values, { resetForm }) => {
            setIsSubmitting(true);
            try {
              await axios.post("http://localhost:5000/api/venues", values);
              setShowSuccess(true);
              resetForm();
              fetchVenues(); // Refresh venue list
              setActiveStep(0);
              
              // Auto-hide success message after 5 seconds
              setTimeout(() => {
                setShowSuccess(false);
              }, 5000);
            } catch (error) {
              console.error("Error submitting data:", error);
              // alert("Failed to add venue.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, isValid, dirty, validateForm, setTouched }) => {
            const completion = calculateCompletion(values);
            
            // Function to handle validation check before proceeding to next step
            const handleContinue = async () => {
              const validationErrors = await validateForm();
              
              // If there are validation errors
              if (Object.keys(validationErrors).length > 0) {
                // Mark all fields as touched to show errors
                const touchedFields = {};
                Object.keys(VenueSchema.fields).forEach(field => {
                  touchedFields[field] = true;
                });
                setTouched(touchedFields);
                
                // Show error alert
                setShowValidationAlert(true);
                
                // Auto-hide error message after 5 seconds
                setTimeout(() => {
                  setShowValidationAlert(false);
                }, 5000);
              } else {
                // If no errors, proceed to next step
                setActiveStep(1);
              }
            };
            
            return (
              <Form>
                {/* Progress indicator */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={completion} 
                    color={completion === 100 ? "success" : "primary"}
                    size={60}
                    thickness={5}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" color="primary">
                      Form Completion: {completion}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {completion < 100 ? "Please fill in all required fields" : "Ready to submit!"}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Combined Input Section - Step 1 */}
                <Fade in={activeStep === 0} timeout={500}>
                  <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
                    <Grid container spacing={3}>
                      {/* Basic Information */}
                      <Grid item xs={12}>
                        <Typography variant="h6" color="primary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          Basic Information
                          <Tooltip title="Provide essential details about the venue">
                            <InfoOutlined fontSize="small" sx={{ ml: 1 }} />
                          </Tooltip>
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>
                      
                      {/* Venue Name */}
                      <Grid item xs={12} md={6}>
                        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                          <TextField
                            name="venueName"
                            label="Venue Name"
                            fullWidth
                            variant="outlined"
                            value={values.venueName}
                            onChange={handleChange}
                            error={touched.venueName && !!errors.venueName}
                            helperText={touched.venueName && errors.venueName}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MeetingRoom color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Zoom>
                      </Grid>

                      {/* Room Type */}
                      <Grid item xs={12} md={6}>
                        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                          <FormControl fullWidth variant="outlined" error={touched.roomType && !!errors.roomType}>
                            <InputLabel>Room Type</InputLabel>
                            <Select
                              name="roomType"
                              value={values.roomType}
                              onChange={handleChange}
                              label="Room Type"
                              startAdornment={
                                <InputAdornment position="start">
                                  <Category color="primary" />
                                </InputAdornment>
                              }
                            >
                              {roomTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                            {touched.roomType && errors.roomType ? (
                              <Typography variant="caption" color="error">
                                {errors.roomType}
                              </Typography>
                            ) : values.roomType && (
                              <Typography variant="caption" color="text.secondary">
                                Recommended capacity: {getCapacityRecommendation(values.roomType)}
                              </Typography>
                            )}
                          </FormControl>
                        </Zoom>
                      </Grid>

                      {/* Organizer Email */}
                      <Grid item xs={12} md={6}>
                        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                          <TextField
                            name="organizerEmail"
                            label="Organizer Email"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={values.organizerEmail}
                            onChange={handleChange}
                            error={touched.organizerEmail && !!errors.organizerEmail}
                            helperText={touched.organizerEmail && errors.organizerEmail}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Zoom>
                      </Grid>

                      {/* Capacity */}
                      <Grid item xs={12} md={6}>
                        <Zoom in={true} style={{ transitionDelay: '400ms' }}>
                          <TextField
                            name="capacity"
                            type="number"
                            label="Capacity"
                            fullWidth
                            variant="outlined"
                            value={values.capacity}
                            onChange={handleChange}
                            error={touched.capacity && !!errors.capacity}
                            helperText={
                              (touched.capacity && errors.capacity) || 
                              (values.capacity && `${values.capacity} people can be accommodated`)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Badge badgeContent={values.capacity || 0} color="primary" max={999}>
                                    <EventSeat color="primary" />
                                  </Badge>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Zoom>
                      </Grid>

                      {/* Location */}
                      <Grid item xs={12}>
                        <Zoom in={true} style={{ transitionDelay: '500ms' }}>
                          <TextField
                            name="location"
                            label="Location"
                            fullWidth
                            variant="outlined"
                            value={values.location}
                            onChange={handleChange}
                            error={touched.location && !!errors.location}
                            helperText={touched.location && errors.location}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationOn color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Zoom>
                      </Grid>
                      
                      {/* Availability & Features Section */}
                      <Grid item xs={12}>
                        <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 3, display: 'flex', alignItems: 'center' }}>
                          Availability & Features
                          <Tooltip title="Set when the venue is available and what facilities it offers">
                            <InfoOutlined fontSize="small" sx={{ ml: 1 }} />
                          </Tooltip>
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>

                      {/* Availability */}
                      <Grid item xs={12} md={6}>
                        <Zoom in={true} style={{ transitionDelay: '600ms' }}>
                          <FormControl fullWidth variant="outlined" error={touched.availability && !!errors.availability}>
                            <InputLabel>Availability</InputLabel>
                            <Select
                              name="availability"
                              value={values.availability}
                              onChange={handleChange}
                              label="Availability"
                            >
                              <MenuItem value="Available">
                                <Chip 
                                  label="Available" 
                                  size="small" 
                                  sx={{ bgcolor: 'success.light', color: 'white' }}
                                />
                              </MenuItem>
                              <MenuItem value="Reserved">
                                <Chip 
                                  label="Reserved" 
                                  size="small" 
                                  sx={{ bgcolor: 'warning.light', color: 'white' }}
                                />
                              </MenuItem>
                              <MenuItem value="Under Maintenance">
                                <Chip 
                                  label="Under Maintenance" 
                                  size="small" 
                                  sx={{ bgcolor: 'error.light', color: 'white' }}
                                />
                              </MenuItem>
                            </Select>
                            {touched.availability && errors.availability && (
                              <Typography variant="caption" color="error">
                                {errors.availability}
                              </Typography>
                            )}
                          </FormControl>
                        </Zoom>
                      </Grid>

                      {/* Time Slot */}
                      <Grid item xs={12} md={6}>
                        <Zoom in={true} style={{ transitionDelay: '700ms' }}>
                          <TextField
                            name="timeSlot"
                            type="time"
                            label="Time Slot"
                            fullWidth
                            variant="outlined"
                            value={values.timeSlot}
                            onChange={handleChange}
                            error={touched.timeSlot && !!errors.timeSlot}
                            helperText={
                              (touched.timeSlot && errors.timeSlot) ||
                              (values.timeSlot && `Starts at ${values.timeSlot}`)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Timer color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Zoom>
                      </Grid>

                      {/* Facilities */}
                      <Grid item xs={12}>
                        <Zoom in={true} style={{ transitionDelay: '800ms' }}>
                          <Box>
                            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                              Available Facilities
                              <Badge 
                                badgeContent={values.facilities.length} 
                                color="primary"
                                sx={{ ml: 1 }}
                              >
                                <InfoOutlined fontSize="small" />
                              </Badge>
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: 1, 
                              p: 2, 
                              borderRadius: 1, 
                              bgcolor: 'background.paper', 
                              border: '1px solid #e0e0e0',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: '#3f51b5',
                                boxShadow: '0 0 5px rgba(63, 81, 181, 0.3)',
                              }
                            }}>
                              {["Projector", "Whiteboard", "AC", "Sound System", "Mic"].map((item) => (
                                <Zoom in={true} style={{ transitionDelay: `${900 + (100 * ["Projector", "Whiteboard", "AC", "Sound System", "Mic"].indexOf(item))}ms` }} key={item}>
                                  <FormControlLabel
                                    control={
                                      <Field
                                        type="checkbox"
                                        name="facilities"
                                        value={item}
                                        as={Checkbox}
                                        color="primary"
                                      />
                                    }
                                    label={item}
                                    sx={{ 
                                      border: '1px solid #e0e0e0',
                                      borderRadius: 1,
                                      m: 0.5,
                                      px: 1,
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        borderColor: '#3f51b5',
                                        backgroundColor: 'rgba(63, 81, 181, 0.05)',
                                      },
                                      ...(values.facilities.includes(item) && {
                                        borderColor: '#3f51b5',
                                        backgroundColor: 'rgba(63, 81, 181, 0.1)',
                                      }),
                                    }}
                                  />
                                </Zoom>
                              ))}
                            </Box>
                          </Box>
                        </Zoom>
                      </Grid>
                      
                      {/* Continue Button */}
                      <Grid item xs={12}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          fullWidth 
                          size="large"
                          sx={{ 
                            mt: 3, 
                            py: 1.5,
                            borderRadius: 2,
                          }}
                          onClick={handleContinue}
                        >
                          Continue to Review
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
                
                {/* Review & Submit Section - Step 2 */}
                <Fade in={activeStep === 1} timeout={500}>
                  <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                          Review Your Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" color="textSecondary">Venue Name</Typography>
                              <Typography variant="body1" sx={{ mb: 2 }}>{values.venueName}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" color="textSecondary">Room Type</Typography>
                              <Typography variant="body1" sx={{ mb: 2 }}>{values.roomType}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" color="textSecondary">Capacity</Typography>
                              <Typography variant="body1" sx={{ mb: 2 }}>{values.capacity} people</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                              <Typography variant="body1" sx={{ mb: 2 }}>{values.location}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" color="textSecondary">Organizer Email</Typography>
                              <Typography variant="body1" sx={{ mb: 2 }}>{values.organizerEmail}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" color="textSecondary">Availability</Typography>
                              <Chip 
                                label={values.availability} 
                                size="small" 
                                sx={{ 
                                  bgcolor: 
                                    values.availability === 'Available' ? 'success.light' : 
                                    values.availability === 'Reserved' ? 'warning.light' : 
                                    'error.light', 
                                  color: 'white',
                                  mb: 2
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" color="textSecondary">Time Slot</Typography>
                              <Typography variant="body1" sx={{ mb: 2 }}>{values.timeSlot}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="textSecondary">Facilities</Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {values.facilities.length > 0 ? (
                                  values.facilities.map(facility => (
                                    <Chip 
                                      key={facility} 
                                      label={facility} 
                                      size="small" 
                                      color="primary" 
                                      variant="outlined" 
                                    />
                                  ))
                                ) : (
                                  <Typography variant="body2" color="text.secondary">No facilities selected</Typography>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                      
                      {/* Navigation Buttons */}
                      <Grid item xs={6}>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          fullWidth 
                          size="large"
                          sx={{ 
                            mt: 3, 
                            py: 1.5,
                            borderRadius: 2,
                          }}
                          onClick={() => setActiveStep(0)}
                        >
                          Back to Details
                        </Button>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          color="primary" 
                          fullWidth 
                          size="large"
                          sx={{ 
                            mt: 3, 
                            py: 1.5,
                            borderRadius: 2,
                            background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                            boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                          }}
                          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutline />}
                          disabled={isSubmitting || !isValid}
                        >
                          {isSubmitting ? "Submitting..." : "Add Venue"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Paper>
  );
};

// Define PropTypes
VenueForm.propTypes = {
  fetchVenues: PropTypes.func.isRequired,
};

export default VenueForm;