import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, CircularProgress, Alert, Box, 
  Divider, Chip, Container, Card, CardContent, Tooltip,
  Grid, IconButton, Collapse, Stack, Button, TextField, InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const ExaminerList = () => {
  const [examiners, setExaminers] = useState([]);
  const [filteredExaminers, setFilteredExaminers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openRowId, setOpenRowId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const fetchExaminers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/examiners`);
      setExaminers(response.data);
      setFilteredExaminers(response.data);
    } catch (err) {
      console.error('Error fetching examiners:', err);
      setError('Failed to fetch examiners. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExaminers();
  }, []);

  useEffect(() => {
    // Filter examiners based on search term
    if (searchTerm.trim() === '') {
      setFilteredExaminers(examiners);
    } else {
      const filtered = examiners.filter(examiner => 
        (examiner.name && examiner.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (examiner.email && examiner.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (examiner.department && examiner.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (examiner.position && examiner.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (examiner.areas_of_expertise && examiner.areas_of_expertise.some(area => 
          area.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredExaminers(filtered);
    }
  }, [searchTerm, examiners]);

  // Function to navigate to Add Examiner form
  const handleAddExaminer = () => {
    navigate('/addExaminer');
  };

  // Function to handle edit examiner
  const handleEditExaminer = (examinerId) => {
    navigate(`/editExaminer/${examinerId}`);
  };

  // Function to handle delete examiner
  const handleDeleteExaminer = async (examinerId) => {
    if (confirmDelete === examinerId) {
      try {
        await axios.delete(`${API_BASE_URL}/examiners/${examinerId}`);
        // Refresh the examiner list after deletion
        fetchExaminers();
        setConfirmDelete(null);
      } catch (err) {
        console.error('Error deleting examiner:', err);
        setError('Failed to delete examiner. Please try again.');
      }
    } else {
      setConfirmDelete(examinerId);
      // Auto-reset confirm delete after 3 seconds
      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  // Function to generate a consistent pastel color based on department
  const getDepartmentColor = (department) => {
    if (!department) return '#e6e6fa'; // default lavender color
    
    const colors = {
      'IT': '#b3e0ff',
      'SE': '#ffd6cc',
      'DS': '#d9f2d9',
      'CS': '#ffe6cc',
      'Software Engineering': '#ffd6cc',
      'Data Science': '#d9f2d9',
      'Computer Science': '#ffe6cc',
      'Information Technology': '#b3e0ff'
    };
    
    return colors[department] || '#e6e6fa';
  };

  // Calculate statistics
  const getStats = () => {
    if (!examiners || examiners.length === 0) return {
      totalExaminers: 0,
      departments: 0,
      mostCommonExpertise: 'N/A',
      totalAvailabilitySlots: 0,
      mostCommonDept: 'N/A'
    };
    
    const departments = {};
    const expertiseAreas = {};
    let totalAvailabilitySlots = 0;
    let mostCommonDept = { name: '', count: 0 };
    let mostCommonExpertise = { name: '', count: 0 };
    
    examiners.forEach(examiner => {
      // Count departments
      if (examiner.department) {
        departments[examiner.department] = (departments[examiner.department] || 0) + 1;
        
        // Track most common department
        if (departments[examiner.department] > mostCommonDept.count) {
          mostCommonDept = { 
            name: examiner.department, 
            count: departments[examiner.department] 
          };
        }
      }
      
      // Count expertise areas and find most common
      examiner.areas_of_expertise?.forEach(area => {
        expertiseAreas[area] = (expertiseAreas[area] || 0) + 1;
        
        if (expertiseAreas[area] > mostCommonExpertise.count) {
          mostCommonExpertise = {
            name: area,
            count: expertiseAreas[area]
          };
        }
      });
      
      // Sum up all availability slots
      totalAvailabilitySlots += examiner.availability?.length || 0;
    });
    
    return {
      totalExaminers: examiners.length,
      departments: Object.keys(departments).length,
      mostCommonExpertise: mostCommonExpertise.name || 'N/A',
      totalAvailabilitySlots: totalAvailabilitySlots,
      mostCommonDept: mostCommonDept.name || 'N/A'
    };
  };

  const stats = getStats();

  const toggleRow = (id) => {
    setOpenRowId(openRowId === id ? null : id);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: '#666' }}>
          Loading examiner data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 6, mx: 'auto', maxWidth: '600px' }}>
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          {error}
        </Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => fetchExaminers()}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 6, mb: 8 }}>
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{ 
            fontWeight: 700, 
            color: '#1976d2',
            letterSpacing: '0.5px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Examiner Directory
        </Typography>

        <Divider sx={{ 
          mb: 5, 
          width: '100px', 
          mx: 'auto', 
          borderColor: '#1976d2', 
          borderWidth: 2,
          borderRadius: 1
        }} />

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              height: '100%',
              background: 'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <PeopleAltIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {stats.totalExaminers}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Examiners
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              height: '100%',
              background: 'linear-gradient(135deg, #c8e6c9 0%, #e8f5e9 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <BusinessCenterIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#388e3c">
                  {stats.departments}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Departments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              height: '100%',
              background: 'linear-gradient(135deg, #ffecb3 0%, #fff8e1 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AssignmentIndIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="#f57c00" sx={{ wordBreak: 'break-word', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stats.mostCommonExpertise}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Most Common Expertise
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              height: '100%',
              background: 'linear-gradient(135deg, #e1bee7 0%, #f3e5f5 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <EventAvailableIcon sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#7b1fa2">
                  {stats.totalAvailabilitySlots}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Availability Slots
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Examiner Button and Search Bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddExaminer}
            sx={{
              borderRadius: 2,
              padding: '10px 20px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
              }
            }}
          >
            Add New Examiner
          </Button>
          
          <TextField
            placeholder="Search examiners..."
            variant="outlined"
            fullWidth
            sx={{ 
              maxWidth: { sm: '300px', md: '400px' },
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
              }
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Card 
          elevation={6}
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            border: '1px solid rgba(25, 118, 210, 0.1)',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  }}>
                    <TableCell sx={{ 
                      color: 'black', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e3f2fd',
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
                        <Typography variant="subtitle1" fontWeight="bold">Name</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'black', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e3f2fd',
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <EmailIcon sx={{ mr: 1, color: '#1976d2' }} />
                        <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'black', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e3f2fd',
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PhoneIcon sx={{ mr: 1, color: '#1976d2' }} />
                        <Typography variant="subtitle1" fontWeight="bold">Phone Number</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'black', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e3f2fd',
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SchoolIcon sx={{ mr: 1, color: '#1976d2' }} />
                        <Typography variant="subtitle1" fontWeight="bold">Department</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'black', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e3f2fd',
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <WorkIcon sx={{ mr: 1, color: '#1976d2' }} />
                        <Typography variant="subtitle1" fontWeight="bold">Position</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'black', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e3f2fd',
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PsychologyIcon sx={{ mr: 1, color: '#1976d2' }} />
                        <Typography variant="subtitle1" fontWeight="bold">Expertise</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'black', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e3f2fd',
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <EventAvailableIcon sx={{ mr: 1, color: '#1976d2' }} />
                        <Typography variant="subtitle1" fontWeight="bold">Availability</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'black', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e3f2fd',
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold">Actions</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExaminers.length > 0 ? (
                    filteredExaminers.map((examiner, index) => (
                      <React.Fragment key={examiner._id || index}>
                        <TableRow
                          sx={{
                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                            '&:hover': {
                              backgroundColor: '#e8f4fd',
                              boxShadow: 'inset 0 0 0 1px rgba(25, 118, 210, 0.1)',
                              transition: 'all 0.2s'
                            },
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight="medium">{examiner.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Send email">
                              <Typography 
                                component="a" 
                                href={`mailto:${examiner.email}`}
                                sx={{ 
                                  color: '#1976d2', 
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                              >
                                {examiner.email}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{examiner.phone_number}</TableCell>
                          <TableCell>
                            <Chip 
                              label={examiner.department} 
                              size="small"
                              sx={{ 
                                backgroundColor: getDepartmentColor(examiner.department),
                                fontWeight: 'medium'
                              }} 
                            />
                          </TableCell>
                          <TableCell>{examiner.position}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {examiner.areas_of_expertise?.map((area, i) => (
                                <Chip 
                                  key={i} 
                                  label={area} 
                                  size="small"
                                  variant="outlined"
                                  sx={{ margin: '2px' }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {examiner.availability?.length || 0} slots
                              </Typography>
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => toggleRow(examiner._id || index)}
                              >
                                {openRowId === (examiner._id || index) ? 
                                  <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <Tooltip title="Edit examiner">
                                <IconButton 
                                  color="primary" 
                                  onClick={() => handleEditExaminer(examiner._id)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={confirmDelete === examiner._id ? "Click again to confirm" : "Delete examiner"}>
                                <IconButton 
                                  color={confirmDelete === examiner._id ? "error" : "default"}
                                  onClick={() => handleDeleteExaminer(examiner._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                            <Collapse in={openRowId === (examiner._id || index)} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 2, backgroundColor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom component="div" sx={{ color: '#1976d2' }}>
                                  Availability Schedule
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {examiner.availability && examiner.availability.length > 0 ? (
                                  <Stack spacing={1}>
                                    {examiner.availability.map((slot, i) => (
                                      <Card key={i} variant="outlined" sx={{ p: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <CalendarTodayIcon sx={{ mr: 2, color: '#1976d2' }} />
                                          <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                              {formatDate(slot.date)}
                                            </Typography>
                                            <Typography variant="body2">
                                              {slot.start_time} - {slot.end_time}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Card>
                                    ))}
                                  </Stack>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    No availability slots found.
                                  </Typography>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          No examiners found matching your search criteria.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ExaminerList;