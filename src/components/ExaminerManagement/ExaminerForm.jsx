import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  Container,
  FormHelperText,
  FormControl,
  List,
  ListItem,
  ListItemText,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Alert,
  Snackbar
} from "@mui/material";
import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Person,
  Email,
  Phone,
  Business,
  Work,
  School,
  Schedule,
  AddCircleOutline,
  Delete,
  CalendarMonth,
  AccessTime,
} from "@mui/icons-material";

const API_BASE_URL = 'http://localhost:5000/api';

export default function ExaminerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "", // Matches backend field
    department: "",
    position: "",
    areas_of_expertise: [], // Matches backend field
    availability: [], // Matches backend field
  });

  const [currentSlot, setCurrentSlot] = useState({
    date: null,
    start_time: null,
    end_time: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone_number: "",
    department: "",
    position: "",
    areas_of_expertise: "",
    date: "",
    time: "",
  });

  // For success/error messages
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Available expertise options based on backend expectations
  const expertiseOptions = [
    { value: "Software Development", label: "Software Development" },
    { value: "Web Development", label: "Web Development" },
    { value: "Mobile Apps", label: "Mobile Apps" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "Data Science", label: "Data Science" },
    { value: "Database Systems", label: "Database Systems" },
    { value: "Computer Networks", label: "Computer Networks" },
    { value: "Cybersecurity", label: "Cybersecurity" },
    { value: "Cloud Computing", label: "Cloud Computing" },
    { value: "DevOps", label: "DevOps" },
    { value: "Game Development", label: "Game Development" },
  ];

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
    
    setErrors({ ...errors, [name]: error });
  };

  const handleExpertiseChange = (e) => {
    const { value, checked } = e.target;
    let updatedExpertise = [...formData.areas_of_expertise];
    
    if (checked) {
      updatedExpertise.push(value);
    } else {
      updatedExpertise = updatedExpertise.filter(item => item !== value);
    }
    
    setFormData({ ...formData, areas_of_expertise: updatedExpertise });
    
    // Validate expertise
    const expertiseError = validateExpertise(updatedExpertise);
    setErrors({ ...errors, areas_of_expertise: expertiseError });
  };

  const handleDateChange = (date) => {
    setCurrentSlot({ ...currentSlot, date });
    const dateError = validateDate(date);
    setErrors({ ...errors, date: dateError });
  };

  const handleStartTimeChange = (time) => {
    setCurrentSlot({ ...currentSlot, start_time: time });
    const timeError = validateTime(time, currentSlot.end_time);
    setErrors({ ...errors, time: timeError });
  };

  const handleEndTimeChange = (time) => {
    setCurrentSlot({ ...currentSlot, end_time: time });
    const timeError = validateTime(currentSlot.start_time, time);
    setErrors({ ...errors, time: timeError });
  };

  const addAvailabilitySlot = () => {
    // Validate date and time slots
    const dateError = validateDate(currentSlot.date);
    const timeError = validateTime(currentSlot.start_time, currentSlot.end_time);
    
    setErrors({ 
      ...errors, 
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
      
      setErrors({ ...errors, date: "", time: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone_number: validatePhone(formData.phone_number),
      department: validateSelect(formData.department, "Department"),
      position: validateSelect(formData.position, "Position"),
      areas_of_expertise: validateExpertise(formData.areas_of_expertise),
    };

    // Check if availability slots are added
    if (formData.availability.length === 0) {
      newErrors.date = "At least one availability slot is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please correct the form errors before submitting.",
        severity: "error"
      });
      return;
    }
    
    try {
      console.log("Submitting examiner data:", formData);
      
      // Send data to backend with proper API format
      const response = await axios.post(`${API_BASE_URL}/examiners/`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("API response:", response.data);
      
      setSnackbar({
        open: true,
        message: "Examiner added successfully!",
        severity: "success"
      });
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        department: "",
        position: "",
        areas_of_expertise: [],
        availability: [],
      });
      
      // Navigate back to examiner list after short delay
      setTimeout(() => {
        navigate('/ExaminerList');
      }, 2000);
      
    } catch (error) {
      console.error("Error adding examiner:", error);
      
      // Detailed error logging to help with debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request made but no response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      
      setSnackbar({
        open: true,
        message: `Error adding examiner: ${error.response?.data?.message || error.message || "Please try again"}`,
        severity: "error"
      });
    }
  };

  const removeAvailabilitySlot = (index) => {
    const updatedSlots = [...formData.availability];
    updatedSlots.splice(index, 1);
    setFormData({
      ...formData,
      availability: updatedSlots,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

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
        pt: 10, // Increased to account for navbar
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
                Add Examiner
              </Typography>
              <Typography variant="subtitle1">Enter examiner details and availability below</Typography>
            </Box>

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
                      error={!!errors.name}
                      helperText={errors.name}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Person color="primary" /></InputAdornment>,
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
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Email color="primary" /></InputAdornment>,
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
                      error={!!errors.phone_number}
                      helperText={errors.phone_number}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Phone color="primary" /></InputAdornment>,
                      }}
                    />
                  </Grid>

                  {/* Department, Position */}
                  <Grid item xs={12}>
                    <TextField 
                      select 
                      fullWidth 
                      label="Department" 
                      name="department" 
                      value={formData.department} 
                      onChange={handleChange} 
                      margin="normal" 
                      required
                      error={!!errors.department}
                      helperText={errors.department}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Business color="primary" /></InputAdornment>,
                      }}
                    >
                      <MenuItem value="IT">Information Technology</MenuItem>
                      <MenuItem value="SE">Software Engineering</MenuItem>
                      <MenuItem value="DS">Data Science</MenuItem>
                      <MenuItem value="CS">Computer Science</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      select 
                      fullWidth 
                      label="Position" 
                      name="position" 
                      value={formData.position} 
                      onChange={handleChange} 
                      margin="normal" 
                      required
                      error={!!errors.position}
                      helperText={errors.position}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Work color="primary" /></InputAdornment>,
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
                      error={!!errors.areas_of_expertise} 
                      component="fieldset" 
                      sx={{ mt: 2 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <School color="primary" sx={{ mt: 0.5, mr: 1 }} />
                        <FormLabel component="legend" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
                          Areas of Expertise
                        </FormLabel>
                      </Box>
                      
                      <FormGroup sx={{ 
                        ml: 4,
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } 
                      }}>
                        {expertiseOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            control={
                              <Checkbox 
                                checked={formData.areas_of_expertise.includes(option.value)} 
                                onChange={handleExpertiseChange} 
                                value={option.value}
                                color="primary"
                              />
                            }
                            label={option.label}
                          />
                        ))}
                      </FormGroup>
                      {errors.areas_of_expertise && (
                        <FormHelperText error>{errors.areas_of_expertise}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Display selected expertise as chips */}
                  {formData.areas_of_expertise.length > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {formData.areas_of_expertise.map(skill => (
                          <Chip
                            key={skill}
                            label={skill}
                            color="primary"
                            variant="outlined"
                            onDelete={() => {
                              const updatedExpertise = formData.areas_of_expertise.filter(item => item !== skill);
                              setFormData({ ...formData, areas_of_expertise: updatedExpertise });
                              setErrors({ 
                                ...errors, 
                                areas_of_expertise: validateExpertise(updatedExpertise) 
                              });
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {/* Availability Section */}
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
                      Availability
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                      <FormControl fullWidth error={!!errors.date}>
                        <DatePicker 
                          label="Select Date" 
                          value={currentSlot.date} 
                          onChange={handleDateChange}
                          disablePast
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: 'outlined',
                              error: !!errors.date
                            }
                          }}
                        />
                        {errors.date && <FormHelperText error>{errors.date}</FormHelperText>}
                      </FormControl>
                    </Box>
                    
                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2, 
                      mb: 2,
                      alignItems: { xs: 'stretch', sm: 'center' } 
                    }}>
                      <FormControl sx={{ width: { xs: '100%', sm: '45%' } }} error={!!errors.time}>
                        <TimePicker 
                          label="Start Time" 
                          value={currentSlot.start_time} 
                          onChange={handleStartTimeChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: 'outlined',
                              error: !!errors.time
                            }
                          }}
                        />
                      </FormControl>
                      <FormControl sx={{ width: { xs: '100%', sm: '45%' } }} error={!!errors.time}>
                        <TimePicker 
                          label="End Time" 
                          value={currentSlot.end_time} 
                          onChange={handleEndTimeChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: 'outlined',
                              error: !!errors.time
                            }
                          }}
                        />
                      </FormControl>
                    </Box>
                    
                    {errors.time && (
                      <FormHelperText error sx={{ mt: -1, mb: 2 }}>
                        {errors.time}
                      </FormHelperText>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <Button 
                        onClick={addAvailabilitySlot} 
                        variant="contained" 
                        color="primary"
                        disabled={!!errors.date || !!errors.time}
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
                        startIcon={<CalendarMonth />}
                      >
                        Add Availability
                      </Button>
                    </Box>
                    
                    {/* Display added availability slots */}
                    {formData.availability.length > 0 && (
                      <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
                          Added Availability
                        </Typography>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }} dense>
                          {formData.availability.map((slot, idx) => (
                            <Paper key={idx} sx={{ mb: 2, overflow: 'hidden' }}>
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
                                  {dayjs(slot.date).format('MMMM D, YYYY')}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => removeAvailabilitySlot(idx)} 
                                  sx={{ color: 'white' }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                              <Box sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2">
                                    {slot.start_time} - {slot.end_time}
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 2,
                        background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                        boxShadow: "0 3px 5px 2px rgba(63, 81, 181, .3)",
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                      }}
                      startIcon={<AddCircleOutline />}
                    >
                      Add Examiner
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Paper>
        </Container>
      </LocalizationProvider>
      
      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}