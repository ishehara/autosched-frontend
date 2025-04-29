import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  Card,
  CardContent,
  Alert,
  InputAdornment
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ClassIcon from '@mui/icons-material/Class';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CodeIcon from '@mui/icons-material/Code';

const EditPresentation = () => {
  const { id } = useParams(); // Grab the presentation ID from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    group_id: '',
    module: '',
    num_attendees: '',
    required_examiners: '',
    technology_category: ''
  });
  
  // Technology categories
  const technologyCategories = [
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
    "Game Development"
  ];

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [moduleError, setModuleError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/presentations/${id}`);
        const data = response.data;
        
        setFormData({
          group_id: data.group_id || '',
          module: data.module || '',
          num_attendees: data.num_attendees || '',
          required_examiners: data.required_examiners || '',
          technology_category: data.technology_category || ''
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching presentation:', error);
        setError('Failed to fetch presentation details');
        setLoading(false);
      }
    };
    
    fetchPresentation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for module field
    if (name === 'module') {
      // Convert to uppercase for first two characters
      const formattedValue = value.toUpperCase();
      
      // Validate module format as user types
      if (value) {
        const moduleRegex = /^[A-Z]{2}\d{0,4}$/;
        if (!moduleRegex.test(formattedValue)) {
          setModuleError('Module must have 2 uppercase letters followed by 4 numbers');
        } else if (formattedValue.length > 6) {
          setModuleError('Module cannot exceed 6 characters');
        } else {
          setModuleError('');
        }
      } else {
        setModuleError('');
      }
      
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleTechnologyChange = (technology) => {
    setFormData({
      ...formData,
      technology_category: technology
    });
  };

  const validateForm = () => {
    if (!formData.group_id.trim()) {
      setError('Group ID is required');
      return false;
    }
    
    // Module validation
    if (!formData.module.trim()) {
      setError('Module is required');
      return false;
    }
    
    const moduleRegex = /^[A-Z]{2}\d{4}$/;
    if (!moduleRegex.test(formData.module)) {
      setError('Module must be in format: 2 uppercase letters followed by 4 numbers (e.g., IT3040)');
      return false;
    }
    
    if (!formData.num_attendees || parseInt(formData.num_attendees) <= 0) {
      setError('Number of attendees must be a positive number');
      return false;
    }
    
    if (!formData.required_examiners || parseInt(formData.required_examiners) <= 0) {
      setError('Required examiners must be a positive number');
      return false;
    }
    
    if (!formData.technology_category) {
      setError('Please select a technology category');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create a modified form data object with integer conversions
      const submissionData = {
        ...formData,
        // Convert string values to integers for numeric fields
        num_attendees: parseInt(formData.num_attendees, 10),
        required_examiners: parseInt(formData.required_examiners, 10)
      };

      await axios.put(`http://localhost:5000/api/presentations/${id}`, submissionData);
      setMessage('Presentation updated successfully!');
      
      // Navigate after successful submission
      setTimeout(() => {
        navigate('/presentations');
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating presentation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh'
      }}>
        <Typography variant="h6">Loading presentation data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '120vh', 
      p: 3,
      backgroundColor: '#f5f7fa'
    }}>
      <Card 
        elevation={6} 
        sx={{ 
          width: '100%',
          maxWidth: 800,
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          p: 3, 
          backgroundColor: '#3f51b5', 
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h4" fontWeight="bold">
            Edit Presentation
          </Typography>
          <Typography variant="subtitle1">
            Update presentation details below
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {message && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Group ID"
                  name="group_id"
                  value={formData.group_id}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="e.g., Y3S2-WE-23"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Module"
                  name="module"
                  value={formData.module}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="e.g., IT3040"
                  inputProps={{ 
                    maxLength: 6,
                  }}
                  error={!!moduleError}
                  helperText={moduleError || "Format: 2 uppercase letters + 4 numbers (e.g., IT3040)"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ClassIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Number of Attendees"
                  name="num_attendees"
                  type="number"
                  value={formData.num_attendees}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="e.g., 5"
                  inputProps={{ min: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleAltIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Required Examiners"
                  name="required_examiners"
                  type="number"
                  value={formData.required_examiners}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="e.g., 2"
                  inputProps={{ min: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonSearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <FormControl
                  component="fieldset"
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CodeIcon color="primary" sx={{ mr: 1 }} />
                    <FormLabel component="legend" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                      Technology Category *
                    </FormLabel>
                  </Box>
                  
                  <Box sx={{ 
                    p: 3, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 1,
                    backgroundColor: '#f5f5f5'
                  }}>
                    <FormGroup>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Software Development"}
                                onChange={() => handleTechnologyChange("Software Development")}
                                name="Software Development"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Software Development"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Artificial Intelligence"}
                                onChange={() => handleTechnologyChange("Artificial Intelligence")}
                                name="Artificial Intelligence"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Artificial Intelligence"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Database Systems"}
                                onChange={() => handleTechnologyChange("Database Systems")}
                                name="Database Systems"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Database Systems"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Cloud Computing"}
                                onChange={() => handleTechnologyChange("Cloud Computing")}
                                name="Cloud Computing"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Cloud Computing"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Web Development"}
                                onChange={() => handleTechnologyChange("Web Development")}
                                name="Web Development"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Web Development"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Machine Learning"}
                                onChange={() => handleTechnologyChange("Machine Learning")}
                                name="Machine Learning"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Machine Learning"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Computer Networks"}
                                onChange={() => handleTechnologyChange("Computer Networks")}
                                name="Computer Networks"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Computer Networks"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "DevOps"}
                                onChange={() => handleTechnologyChange("DevOps")}
                                name="DevOps"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="DevOps"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Mobile Apps"}
                                onChange={() => handleTechnologyChange("Mobile Apps")}
                                name="Mobile Apps"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Mobile Apps"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Data Science"}
                                onChange={() => handleTechnologyChange("Data Science")}
                                name="Data Science"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Data Science"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Cybersecurity"}
                                onChange={() => handleTechnologyChange("Cybersecurity")}
                                name="Cybersecurity"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Cybersecurity"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.technology_category === "Game Development"}
                                onChange={() => handleTechnologyChange("Game Development")}
                                name="Game Development"
                                color="primary"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                              />
                            }
                            label="Game Development"
                          />
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </Box>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                type="button" 
                variant="outlined"
                onClick={() => navigate('/presentations')}
                sx={{ px: 4 }}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting}
                sx={{ 
                  px: 4,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                  boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                  fontWeight: 'bold',
                }}
              >
                {isSubmitting ? 'Updating...' : 'Update Presentation'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditPresentation;