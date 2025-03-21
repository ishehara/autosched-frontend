import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { 
  People as PeopleIcon, 
  Code as CodeIcon, 
  Build as BuildIcon, 
  Person as PersonIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

// Dummy data to match PresentationView
const dummyData = [
  {
    _id: "1",
    groupid: "Group A",
    modulecode: "CS1001",
    techSpecification: "Technical Specification 1",
    noOfAttendees: 20,
    noOfrequiredExaminers: 3,
  },
  {
    _id: "2",
    groupid: "Group B",
    modulecode: "CS1002",
    techSpecification: "Technical Specification 2",
    noOfAttendees: 15,
    noOfrequiredExaminers: 2,
  },
  {
    _id: "3",
    groupid: "Group C",
    modulecode: "CS1003",
    techSpecification: "Technical Specification 3",
    noOfAttendees: 18,
    noOfrequiredExaminers: 4,
  },
];

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [presentation, setPresentation] = useState({
    groupid: "",
    modulecode: "",
    techSpecification: "",
    noOfAttendees: 4,
    noOfrequiredExaminers: 6,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    groupid: false,
    modulecode: false,
    moduleCodeFormatError: false,
    techSpecification: false,
  });

  // Fetch presentation data when component mounts
  useEffect(() => {
    // Simulate API call using dummy data
    const fetchPresentation = () => {
      try {
        // Find the presentation with matching id in dummy data
        const foundPresentation = dummyData.find(item => item._id === id);
        
        if (foundPresentation) {
          setPresentation(foundPresentation);
          setLoading(false);
        } else {
          setError("Presentation not found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching presentation:", error);
        setError("Failed to load presentation. Please try again.");
        setLoading(false);
      }
    };

    // Short timeout to simulate network request
    setTimeout(fetchPresentation, 500);
  }, [id]);

  // Validate module code format
  const validateModuleCode = (code) => {
    // Pattern: 2 capital letters followed by 4 digits
    const moduleCodePattern = /^[A-Z]{2}\d{4}$/;
    return moduleCodePattern.test(code);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPresentation({
      ...presentation,
      [name]: name === "noOfAttendees" || name === "noOfrequiredExaminers" 
        ? parseInt(value, 10) || 0 
        : value,
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: false
      });
    }

    // Clear module code format error if applicable
    if (name === "modulecode" && formErrors.moduleCodeFormatError) {
      setFormErrors({
        ...formErrors,
        moduleCodeFormatError: false
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check module code format
    const isModuleCodeValid = presentation.modulecode ? validateModuleCode(presentation.modulecode) : false;
    
    // Form validation
    const newErrors = {
      groupid: !presentation.groupid,
      modulecode: !presentation.modulecode,
      moduleCodeFormatError: presentation.modulecode ? !isModuleCodeValid : false,
      techSpecification: !presentation.techSpecification,
    };
    
    setFormErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }
    
    try {
      // Simulate API call for updating presentation
      // In a real app, this would be: await axios.put(`http://localhost:5000/api/presentations/${id}`, presentation);
      
      // Navigate back to presentations list after simulated update
      setTimeout(() => {
        navigate("/presentations");
      }, 500);
    } catch (error) {
      console.error("Error updating presentation:", error);
      setError("Failed to update presentation. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: "#1976d2" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, maxWidth: "800px", mx: "auto", p: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          sx={{ mt: 2 }}
          variant="contained" 
          onClick={() => navigate("/presentations")}
          color="primary"
        >
          Back to Presentations
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        ml: 50,
        mr: 50,
      }}
    >
      {/* Header - similar to the Reports header in the image */}
      <Box 
        sx={{ 
          bgcolor: "#1976d2", 
          color: "white", 
          p: 2, 
          mb: 3,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Typography variant="h5" component="h1" sx={{ display: "flex", alignItems: "center" }}>
          <BuildIcon sx={{ mr: 1.5 }} /> Presentations
        </Typography>
      </Box>

      {/* Main content */}
      <Paper 
        elevation={1} 
        sx={{ 
          maxWidth: "1000px", 
          mx: "auto", 
          overflow: "hidden",
          borderRadius: "4px"
        }}
      >
        {/* Form header */}
        <Box 
          sx={{ 
            bgcolor: "#42a5f5", 
            color: "white", 
            p: 2 
          }}
        >
          <Typography variant="h6" component="h2">
            Edit Presentation
          </Typography>
          <Typography variant="body2">
            Update the presentation details below
          </Typography>
        </Box>

        {/* Form content */}
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Group ID */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography 
                    variant="caption" 
                    component="label"
                    color="textSecondary"
                  >
                    Group ID
                  </Typography>
                  <TextField
                    fullWidth
                    name="groupid"
                    value={presentation.groupid}
                    onChange={handleChange}
                    error={formErrors.groupid}
                    variant="outlined"
                    size="small"
                    placeholder="Enter group identifier"
                    InputProps={{
                      startAdornment: (
                        <PeopleIcon sx={{ mr: 1, color: "#1976d2" }} fontSize="small" />
                      ),
                    }}
                  />
                  {formErrors.groupid && (
                    <FormHelperText error>Group ID is required</FormHelperText>
                  )}
                </Box>
              </Grid>
              
              {/* Module Code */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography 
                    variant="caption" 
                    component="label"
                    color="textSecondary"
                  >
                    Module Code
                  </Typography>
                  <TextField
                    fullWidth
                    name="modulecode"
                    value={presentation.modulecode}
                    onChange={handleChange}
                    error={formErrors.modulecode || formErrors.moduleCodeFormatError}
                    variant="outlined"
                    size="small"
                    placeholder="Format: AA0000 (e.g., CS1001)"
                    InputProps={{
                      startAdornment: (
                        <CodeIcon sx={{ mr: 1, color: "#1976d2" }} fontSize="small" />
                      ),
                    }}
                  />
                  {formErrors.modulecode && (
                    <FormHelperText error>Module Code is required</FormHelperText>
                  )}
                  {formErrors.moduleCodeFormatError && (
                    <FormHelperText error>
                      Invalid format. Module code must be 2 capital letters followed by 4 numbers (e.g., CS1001)
                    </FormHelperText>
                  )}
                </Box>
              </Grid>
              
              {/* Technical Specification */}
              <Grid item xs={12}>
                <Box>
                  <Typography 
                    variant="caption" 
                    component="label"
                    color="textSecondary"
                  >
                    Technical Specification
                  </Typography>
                  <TextField
                    fullWidth
                    name="techSpecification"
                    value={presentation.techSpecification}
                    onChange={handleChange}
                    error={formErrors.techSpecification}
                    variant="outlined"
                    size="small"
                    placeholder="Enter technical details"
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <BuildIcon sx={{ mr: 1, mt: 1, color: "#1976d2" }} fontSize="small" />
                      ),
                    }}
                  />
                  {formErrors.techSpecification && (
                    <FormHelperText error>Technical specification is required</FormHelperText>
                  )}
                </Box>
              </Grid>
              
              {/* Number of Attendees */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography 
                    variant="caption" 
                    component="label"
                    color="textSecondary"
                  >
                    Number of Attendees
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="noOfAttendees"
                      value={presentation.noOfAttendees}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(value) => `${value}`}
                      startAdornment={<PeopleIcon sx={{ ml: 1, mr: 1, color: "#1976d2" }} fontSize="small" />}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <MenuItem key={num} value={num}>{num}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              
              {/* Required Examiners */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography 
                    variant="caption" 
                    component="label"
                    color="textSecondary"
                  >
                    Number of Required Examiners
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="noOfrequiredExaminers"
                      value={presentation.noOfrequiredExaminers}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(value) => `${value}`}
                      startAdornment={<PersonIcon sx={{ ml: 1, mr: 1, color: "#1976d2" }} fontSize="small" />}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <MenuItem key={num} value={num}>{num}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            
            {/* Actions - aligned to match the reports table */}
            <Box 
              sx={{ 
                mt: 4, 
                display: "flex", 
                justifyContent: "flex-end",
                gap: 2 
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/presentations")}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ 
                  bgcolor: "#1976d2", 
                  "&:hover": {
                    bgcolor: "#1565c0"
                  }
                }}
              >
                UPDATE
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPresentation;