import React, { useState } from "react";
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

export default function ExaminerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    expertise: [],
    availableTimeSlots: [],
  });

  const [currentSlot, setCurrentSlot] = useState({
    date: null,
    slots: [{ startTime: null, endTime: null }],
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    expertise: "",
    date: "",
    timeSlots: [],
  });

  const [timeSlotErrors, setTimeSlotErrors] = useState([""]);

  // Available expertise options
  const expertiseOptions = [
    { value: "AI", label: "Artificial Intelligence" },
    { value: "Cybersecurity", label: "Cybersecurity" },
    { value: "Data Science", label: "Data Science" },
    { value: "DA", label: "Database Administration" },
    { value: "UI", label: "UX/UI Design" },
    { value: "MAD", label: "Mobile Application Development" },
  ];

  const validateName = (value) => {
    if (!value.trim()) return "Name is required";
    if (value.length < 3) return "Name must be at least 3 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters";
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

  const validateTimeSlot = (slot, index) => {
    if (!slot.startTime || !slot.endTime) return "Both start and end times are required";
    if (slot.startTime.isAfter(slot.endTime)) return "Start time must be before end time";
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
      case "phone":
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
    let updatedExpertise = [...formData.expertise];
    
    if (checked) {
      updatedExpertise.push(value);
    } else {
      updatedExpertise = updatedExpertise.filter(item => item !== value);
    }
    
    setFormData({ ...formData, expertise: updatedExpertise });
    
    // Validate expertise
    const expertiseError = validateExpertise(updatedExpertise);
    setErrors({ ...errors, expertise: expertiseError });
  };

  const handleDateChange = (date) => {
    setCurrentSlot({ ...currentSlot, date });
    const dateError = validateDate(date);
    setErrors({ ...errors, date: dateError });
  };

  const handleSlotChange = (index, key, value) => {
    const updatedSlots = [...currentSlot.slots];
    updatedSlots[index][key] = value;
    setCurrentSlot({ ...currentSlot, slots: updatedSlots });
    
    // Validate this time slot
    const updatedErrors = [...timeSlotErrors];
    updatedErrors[index] = validateTimeSlot(
      { startTime: key === "startTime" ? value : updatedSlots[index].startTime, 
        endTime: key === "endTime" ? value : updatedSlots[index].endTime 
      }, 
      index
    );
    setTimeSlotErrors(updatedErrors);
  };

  const addSlot = () => {
    setCurrentSlot({
      ...currentSlot,
      slots: [...currentSlot.slots, { startTime: null, endTime: null }],
    });
    setTimeSlotErrors([...timeSlotErrors, ""]);
  };

  const removeSlot = (index) => {
    const updatedSlots = [...currentSlot.slots];
    updatedSlots.splice(index, 1);
    setCurrentSlot({ ...currentSlot, slots: updatedSlots });
    
    const updatedErrors = [...timeSlotErrors];
    updatedErrors.splice(index, 1);
    setTimeSlotErrors(updatedErrors);
  };

  const addDateSlot = () => {
    // Validate date and time slots
    const dateError = validateDate(currentSlot.date);
    
    const updatedTimeSlotErrors = currentSlot.slots.map((slot, index) => 
      validateTimeSlot(slot, index)
    );
    
    setErrors({ ...errors, date: dateError });
    setTimeSlotErrors(updatedTimeSlotErrors);
    
    // Check if there are any errors
    if (dateError || updatedTimeSlotErrors.some(error => error)) {
      return; // Don't add if there are errors
    }
    
    if (currentSlot.date && currentSlot.slots.length > 0) {
      setFormData({
        ...formData,
        availableTimeSlots: [...formData.availableTimeSlots, currentSlot],
      });
      setCurrentSlot({ date: null, slots: [{ startTime: null, endTime: null }] });
      setTimeSlotErrors([""]);
      setErrors({ ...errors, date: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      department: validateSelect(formData.department, "Department"),
      position: validateSelect(formData.position, "Position"),
      expertise: validateExpertise(formData.expertise),
    };

    // Check if availability slots are added
    if (formData.availableTimeSlots.length === 0) {
      newErrors.date = "At least one busy hour is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please correct the form errors before submitting.");
      return;
    }
    
    console.log("Submitting:", formData);
    
    try {
      const response = await fetch("http://your-backend-api/examiners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Examiner added successfully!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          department: "",
          position: "",
          expertise: [],
          availableTimeSlots: [],
        });
      } else {
        alert("Error adding examiner.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const removeDateSlot = (index) => {
    const updatedSlots = [...formData.availableTimeSlots];
    updatedSlots.splice(index, 1);
    setFormData({
      ...formData,
      availableTimeSlots: updatedSlots,
    });
  };

  // Helper function to get expertise label from value
  const getExpertiseLabel = (value) => {
    const option = expertiseOptions.find(opt => opt.value === value);
    return option ? option.label : value;
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
        pt: 5,
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
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!errors.phone}
                      helperText={errors.phone}
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
                      error={!!errors.expertise} 
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
                                checked={formData.expertise.includes(option.value)} 
                                onChange={handleExpertiseChange} 
                                value={option.value}
                                color="primary"
                              />
                            }
                            label={option.label}
                          />
                        ))}
                      </FormGroup>
                      {errors.expertise && (
                        <FormHelperText error>{errors.expertise}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Display selected expertise as chips */}
                  {formData.expertise.length > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {formData.expertise.map(skill => (
                          <Chip
                            key={skill}
                            label={getExpertiseLabel(skill)}
                            color="primary"
                            variant="outlined"
                            onDelete={() => {
                              const updatedExpertise = formData.expertise.filter(item => item !== skill);
                              setFormData({ ...formData, expertise: updatedExpertise });
                              setErrors({ 
                                ...errors, 
                                expertise: validateExpertise(updatedExpertise) 
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
                    
                    <FormControl fullWidth error={!!errors.date} sx={{ mb: 1 }}>
                      <DatePicker 
                        label="Select Date" 
                        value={currentSlot.date} 
                        onChange={handleDateChange}
                        sx={{ width: "100%", mt: 1 }}
                        disablePast
                      />
                      {errors.date && <FormHelperText error>{errors.date}</FormHelperText>}
                    </FormControl>
                    
                    {currentSlot.slots.map((slot, index) => (
                      <Box key={index} sx={{ 
                        display: "flex", 
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1, 
                        mt: 2, 
                        alignItems: { xs: 'stretch', sm: 'center' } 
                      }}>
                        <FormControl sx={{ width: { xs: '100%', sm: '45%' } }} error={!!timeSlotErrors[index]}>
                          <TimePicker 
                            label="Start Time" 
                            value={slot.startTime} 
                            onChange={(time) => handleSlotChange(index, "startTime", time)} 
                          />
                        </FormControl>
                        <FormControl sx={{ width: { xs: '100%', sm: '45%' } }} error={!!timeSlotErrors[index]}>
                          <TimePicker 
                            label="End Time" 
                            value={slot.endTime} 
                            onChange={(time) => handleSlotChange(index, "endTime", time)} 
                          />
                        </FormControl>
                        <IconButton onClick={() => removeSlot(index)} color="error" sx={{ mt: { xs: 1, sm: 0 } }}>
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                    {timeSlotErrors.some(error => error) && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        {timeSlotErrors.find(error => error)}
                      </FormHelperText>
                    )}
                    
                    <Box sx={{ mt: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                      <Button 
                        onClick={addSlot} 
                        variant="outlined" 
                        sx={{ px: 3 }}
                      >
                        + Add Another Time Slot
                      </Button>
                      <Button 
                        onClick={addDateSlot} 
                        variant="contained" 
                        color="primary"
                        disabled={!!errors.date || timeSlotErrors.some(error => error)}
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
                        Add Date
                      </Button>
                    </Box>
                    
                    {/* Display added time slots - Improved organization */}
                    {formData.availableTimeSlots.length > 0 && (
                      <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
                          Added Availability
                        </Typography>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }} dense>
                          {formData.availableTimeSlots.map((dateSlot, idx) => (
                            <Paper key={idx} sx={{ mb: 2, overflow: 'hidden' }}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                bgcolor: '#6F8FAF	',
                                color: 'primary.contrastText',
                                px: 2,
                                py: 1
                              }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {dayjs(dateSlot.date).format('MMMM D, YYYY')}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => removeDateSlot(idx)} 
                                  sx={{ color: 'white' }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                              <List disablePadding>
                                {dateSlot.slots.map((slot, slotIdx) => (
                                  <ListItem 
                                    key={slotIdx} 
                                    divider={slotIdx < dateSlot.slots.length - 1}
                                    sx={{ py: 0.5 }}
                                  >
                                    <ListItemText 
                                      primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                          <Typography variant="body2">
                                            {dayjs(slot.startTime).format('h:mm A')} - {dayjs(slot.endTime).format('h:mm A')}
                                          </Typography>
                                        </Box>
                                      } 
                                    />
                                  </ListItem>
                                ))}
                              </List>
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
    </Box>
  );
}