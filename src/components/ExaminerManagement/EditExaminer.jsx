import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  List,
  Card,
  Container
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SaveIcon from '@mui/icons-material/Save';

const API_BASE_URL = 'http://localhost:5000/api';

const EditExaminer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [redirectPending, setRedirectPending] = useState(false);
  const successTimeoutRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    department: "",
    position: "",
    areas_of_expertise: [],
    availability: []
  });

  const [currentSlot, setCurrentSlot] = useState({
    date: null,
    start_time: null,
    end_time: null,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone_number: "",
    department: "",
    position: "",
    areas_of_expertise: "",
    date: "",
    time: "",
  });

  // Available expertise options
  const expertiseOptions = [
    "Software Development",
    "Web Development",
    "Mobile Apps",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Database Systems",
    "Computer Networks",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Game Development",
  ];

  // Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Handle redirect after success message is shown
  useEffect(() => {
    if (redirectPending && success) {
      successTimeoutRef.current = setTimeout(() => {
        navigate('/ExaminerList');
      }, 2000);
    }
  }, [redirectPending, success, navigate]);

  // Fetch examiner data on component mount
  useEffect(() => {
    const fetchExaminer = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/examiners/${id}`);
        const examinerData = response.data;
        
        // Convert availability dates and times to dayjs objects for the form
        setFormData({
          ...examinerData,
          // Ensure these fields exist to prevent errors
          areas_of_expertise: examinerData.areas_of_expertise || [],
          availability: examinerData.availability || []
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching examiner:', err);
        setError('Failed to load examiner data. Please try again.');
        setLoading(false);
      }
    };

    fetchExaminer();
  }, [id]);

  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) return "Name is required";
    if (value.length < 3) return "Name must be at least 3 characters";
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return "Invalid email format";
    return "";
  };

  const validatePhone = (value) => {
    if (!value.trim()) return "Phone number is required";
    if (value.charAt(0) !== "0") return "Phone number must start with 0";
    if (!/^\d{10}$/.test(value)) return "Phone number must be exactly 10 digits";
    return "";
  };

  const validateSelect = (value, field) => {
    if (!value) return `${field} is required`;
    return "";
  };

  const validateExpertise = (expertise) => {
    if (expertise.length === 0) return "At least one area of expertise is required";
    return "";
  };

  const validateDate = (date) => {
    if (!date) return "Date is required";
    if (date.isBefore(dayjs().startOf('day'))) return "Date cannot be in the past";
    return "";
  };

  const validateTime = (startTime, endTime) => {
    if (!startTime || !endTime) return "Both start and end times are required";
    if (startTime.isAfter(endTime)) return "Start time must be before end time";
    return "";
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate the field
    let error = "";
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone_number":
        error = validatePhone(value);
        break;
      case "department":
      case "position":
        error = validateSelect(value, name.charAt(0).toUpperCase() + name.slice(1));
        break;
      default:
        break;
    }
    
    setFormErrors({ ...formErrors, [name]: error });
  };

  // Handle expertise selection
  const handleExpertiseChange = (event) => {
    const { target: { value } } = event;
    const expertise = typeof value === 'string' ? value.split(',') : value;
    
    setFormData({ ...formData, areas_of_expertise: expertise });
    setFormErrors({ 
      ...formErrors, 
      areas_of_expertise: validateExpertise(expertise)
    });
  };

  // Handle date and time inputs for availability
  const handleDateChange = (date) => {
    setCurrentSlot({ ...currentSlot, date });
    const dateError = validateDate(date);
    setFormErrors({ ...formErrors, date: dateError });
  };

  const handleStartTimeChange = (time) => {
    setCurrentSlot({ ...currentSlot, start_time: time });
    const timeError = validateTime(time, currentSlot.end_time);
    setFormErrors({ ...formErrors, time: timeError });
  };

  const handleEndTimeChange = (time) => {
    setCurrentSlot({ ...currentSlot, end_time: time });
    const timeError = validateTime(currentSlot.start_time, time);
    setFormErrors({ ...formErrors, time: timeError });
  };

  // Add availability slot
  const addAvailabilitySlot = () => {
    // Validate date and time slots
    const dateError = validateDate(currentSlot.date);
    const timeError = validateTime(currentSlot.start_time, currentSlot.end_time);
    
    setFormErrors({ 
      ...formErrors, 
      date: dateError,
      time: timeError
    });
    
    // Don't add if there are errors
    if (dateError || timeError) {
      return;
    }
    
    if (currentSlot.date && currentSlot.start_time && currentSlot.end_time) {
      // Format to match backend expectations
      const newSlot = {
        date: currentSlot.date.format('YYYY-MM-DD'),
        start_time: currentSlot.start_time.format('HH:mm'),
        end_time: currentSlot.end_time.format('HH:mm')
      };
      
      setFormData({
        ...formData,
        availability: [...formData.availability, newSlot],
      });
      
      // Reset current slot
      setCurrentSlot({ 
        date: null, 
        start_time: null, 
        end_time: null 
      });
      
      setFormErrors({ ...formErrors, date: "", time: "" });
    }
  };

  // Remove availability slot
  const removeAvailabilitySlot = (index) => {
    const updatedSlots = [...formData.availability];
    updatedSlots.splice(index, 1);
    setFormData({
      ...formData,
      availability: updatedSlots,
    });
  };

  // Form validation before submission
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone_number: validatePhone(formData.phone_number),
      department: validateSelect(formData.department, "Department"),
      position: validateSelect(formData.position, "Position"),
      areas_of_expertise: validateExpertise(formData.areas_of_expertise),
    };

    setFormErrors(newErrors);

    // Return true if there are no errors
    return !Object.values(newErrors).some(error => error);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please correct the form errors before submitting.');
      setSuccess(''); // Clear any previous success messages
      return;
    }
    
    try {
      setSubmitting(true);
      setError(''); // Clear any previous errors
      setSuccess(''); // Clear any previous success messages
      
      // Create a copy of formData without the _id field to prevent the MongoDB error
      const { _id, ...updateData } = formData;
      
      const response = await axios.put(`${API_BASE_URL}/examiners/${id}`, updateData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("API response:", response.data);
      
      setSubmitting(false);
      
      // Show success message and set redirect flag
      window.scrollTo(0, 0); // Scroll to top to ensure message is visible
      setSuccess('Examiner updated successfully!');
      setRedirectPending(true);
      
    } catch (err) {
      console.error("Error updating examiner:", err);
      setError(`Error updating examiner: ${err.response?.data?.message || err.message || "Please try again"}`);
      setSubmitting(false);
      setRedirectPending(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  if (loading && !formData.name) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 2 
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading examiner data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        pt: 10, // Space for navbar
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container 
          maxWidth="md" 
          sx={{ 
            padding: 0,
            margin: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: { xs: '95%', sm: '90%', md: '80%' },
              p: 2,
              borderRadius: 3,
              overflow: 'visible',
              margin: '20px 0',
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                p: 3,
                background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                color: "white",
                textAlign: "center",
                borderRadius: "4px 4px 0 0",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                Edit Examiner
              </Typography>
              <Typography variant="subtitle1">Update examiner details and availability</Typography>
            </Box>

            {/* Alert messages - fixed position to ensure visibility */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  width: '100%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  position: "sticky",
                  top: error ? 'auto' : 0,
                  zIndex: 10,
                  width: '100%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  bgcolor: '#e8f5e9',
                  fontWeight: 'medium',
                  fontSize: '1rem',
                  '& .MuiAlert-icon': {
                    fontSize: '1.25rem'
                  }
                }}
              >
                {success} {redirectPending && "Redirecting to Examiner List..."}
              </Alert>
            )}

            <Box sx={{ p: { xs: 2, sm: 4 } }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Basic Information Section */}
                  <Grid item xs={12}>
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      sx={{ 
                        mb: 1, 
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        fontSize: '1.25rem' 
                      }}
                    >
                      Basic Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  {/* Name, Email, Phone */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!formErrors.phone_number}
                      helperText={formErrors.phone_number}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><PhoneIcon color="primary" /></InputAdornment>,
                      }}
                    />
                  </Grid>

                  {/* Department, Position */}
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      select 
                      fullWidth 
                      label="Department" 
                      name="department" 
                      value={formData.department || ""} 
                      onChange={handleChange} 
                      margin="normal" 
                      required
                      error={!!formErrors.department}
                      helperText={formErrors.department}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><BusinessIcon color="primary" /></InputAdornment>,
                      }}
                    >
                      <MenuItem value="Information Technology">Information Technology</MenuItem>
                      <MenuItem value="Software Engineering">Software Engineering</MenuItem>
                      <MenuItem value="Data Science">Data Science</MenuItem>
                      <MenuItem value="Computer Science">Computer Science</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      select 
                      fullWidth 
                      label="Position" 
                      name="position" 
                      value={formData.position || ""} 
                      onChange={handleChange} 
                      margin="normal" 
                      required
                      error={!!formErrors.position}
                      helperText={formErrors.position}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><WorkIcon color="primary" /></InputAdornment>,
                      }}
                    >
                      <MenuItem value="Professor">Professor</MenuItem>
                      <MenuItem value="Senior Lecturer">Senior Lecturer</MenuItem>
                      <MenuItem value="Lecturer">Lecturer</MenuItem>
                      <MenuItem value="Instructor">Instructor</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Expertise */}
                  <Grid item xs={12}>
                    <FormControl 
                      fullWidth 
                      required 
                      error={!!formErrors.areas_of_expertise} 
                      sx={{ mt: 2 }}
                    >
                      <InputLabel 
                        id="expertise-label" 
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <SchoolIcon sx={{ mr: 1 }} /> Areas of Expertise
                      </InputLabel>
                      <Select
                        labelId="expertise-label"
                        multiple
                        value={formData.areas_of_expertise || []}
                        onChange={handleExpertiseChange}
                        input={<OutlinedInput label="Areas of Expertise" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {expertiseOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.areas_of_expertise && (
                        <FormHelperText error>{formErrors.areas_of_expertise}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Availability Section */}
                  <Grid item xs={12}>
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      sx={{ 
                        mb: 1, 
                        mt: 3,
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        fontSize: '1.25rem' 
                      }}
                    >
                      Availability
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                      <FormControl fullWidth error={!!formErrors.date}>
                        <DatePicker 
                          label="Select Date" 
                          value={currentSlot.date} 
                          onChange={handleDateChange}
                          disablePast
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: 'outlined',
                              error: !!formErrors.date,
                              InputProps: {
                                startAdornment: <InputAdornment position="start"><CalendarMonthIcon color="primary" /></InputAdornment>,
                              }
                            }
                          }}
                        />
                        {formErrors.date && <FormHelperText error>{formErrors.date}</FormHelperText>}
                      </FormControl>
                    </Box>
                    
                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2, 
                      mb: 2,
                      alignItems: { xs: 'stretch', sm: 'center' } 
                    }}>
                      <FormControl sx={{ width: { xs: '100%', sm: '45%' } }} error={!!formErrors.time}>
                        <TimePicker 
                          label="Start Time" 
                          value={currentSlot.start_time} 
                          onChange={handleStartTimeChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: 'outlined',
                              error: !!formErrors.time,
                              InputProps: {
                                startAdornment: <InputAdornment position="start"><AccessTimeIcon color="primary" /></InputAdornment>,
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormControl sx={{ width: { xs: '100%', sm: '45%' } }} error={!!formErrors.time}>
                        <TimePicker 
                          label="End Time" 
                          value={currentSlot.end_time} 
                          onChange={handleEndTimeChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: 'outlined',
                              error: !!formErrors.time,
                              InputProps: {
                                startAdornment: <InputAdornment position="start"><AccessTimeIcon color="primary" /></InputAdornment>,
                              }
                            }
                          }}
                        />
                      </FormControl>
                    </Box>
                    
                    {formErrors.time && (
                      <FormHelperText error sx={{ mt: -1, mb: 2 }}>
                        {formErrors.time}
                      </FormHelperText>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <Button 
                        onClick={addAvailabilitySlot} 
                        variant="contained" 
                        color="primary"
                        disabled={!!formErrors.date || !!formErrors.time}
                        sx={{
                          px: 3,
                          py: 1,
                          fontSize: '0.9rem',
                          fontWeight: 'medium',
                          bgcolor: "primary.main",
                          '&:hover': {
                            bgcolor: "primary.dark",
                          }
                        }}
                        startIcon={<AddCircleOutlineIcon />}
                      >
                        Add Availability
                      </Button>
                    </Box>
                    
                    {/* Display added availability slots */}
                    {formData.availability && formData.availability.length > 0 && (
                      <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
                          Available Time Slots
                        </Typography>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }} dense>
                          {formData.availability.map((slot, idx) => (
                            <Card key={idx} sx={{ mb: 2, overflow: 'hidden' }}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                bgcolor: '#6F8FAF',
                                color: 'primary.contrastText',
                                px: 2,
                                py: 1
                              }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {formatDate(slot.date)}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => removeAvailabilitySlot(idx)} 
                                  sx={{ color: 'white' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <Box sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2">
                                    {slot.start_time} - {slot.end_time}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Grid>

                  {/* Submit & Cancel Buttons */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/ExaminerList')}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: 2,
                        }}
                        disabled={redirectPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={submitting || redirectPending}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: 2,
                          background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                          boxShadow: "0 3px 5px 2px rgba(63, 81, 181, .3)",
                          fontWeight: 'bold',
                        }}
                        startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                      >
                        {submitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Paper>
        </Container>
      </LocalizationProvider>
    </Box>
  );
};

export default EditExaminer;