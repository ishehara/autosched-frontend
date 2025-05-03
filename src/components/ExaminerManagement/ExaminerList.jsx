import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, CircularProgress, Alert, Box, 
  Divider, Chip, Container, Card, CardContent, Tooltip,
  Grid, IconButton, Collapse, Stack, Button, TextField, InputAdornment,
  Snackbar
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
  const [successAlert, setSuccessAlert] = useState({ open: false, message: '' });
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
        // Show success alert
        setSuccessAlert({
          open: true,
          message: 'Examiner deleted successfully'
        });
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

  // Handle closing the success alert
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessAlert({ ...successAlert, open: false });
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

  const handleGenerateReport = () => {
    // Create new jsPDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Color scheme
    const colors = {
      primary: [30, 100, 200],      // Vibrant blue
      secondary: [80, 80, 80],      // Dark gray for text
      lightGray: [240, 240, 240],   // Light gray for alternating rows
      mediumGray: [180, 180, 180],  // Medium gray for borders
      white: [255, 255, 255]        // White
    };
  
    // Add title with styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...colors.primary);
    doc.text('Examiner Directory Report', pageWidth / 2, 30, { align: 'center' });
    
    // Add current date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...colors.secondary);
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Generated on: ${today}`, pageWidth / 2, 40, { align: 'center' });
    
    // Add horizontal line with gradient effect
    const drawGradientLine = (y) => {
      for (let i = 0; i < 50; i++) {
        const opacity = 1 - (i / 50);
        doc.setDrawColor(...colors.primary, opacity);
        doc.setLineWidth(0.5);
        doc.line(margin, y + i/10, pageWidth - margin, y + i/10);
      }
    };
    
    drawGradientLine(45);
    
    // Summary Statistics section with a better layout
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...colors.primary);
    doc.text('Summary Statistics', margin, 60);
    
    // Stats container with rounded rectangle background
    doc.setFillColor(...colors.lightGray);
    doc.roundedRect(margin, 65, contentWidth, 50, 5, 5, 'F');
    
    // Stats content with better organization
    const drawStatItem = (label, value, x, y) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...colors.secondary);
      doc.text(label, x, y);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(...colors.primary);
      doc.text(value.toString(), x, y + 8);
    };
    
    // First row of stats
    drawStatItem('Total Examiners:', stats.totalExaminers, margin + 15, 80);
    drawStatItem('Departments:', stats.departments, margin + contentWidth/2, 80);
    
    // Second row of stats
    drawStatItem('Most Common Expertise:', stats.mostCommonExpertise, margin + 15, 100);
    drawStatItem('Total Availability Slots:', stats.totalAvailabilitySlots, margin + contentWidth/2, 100);
    
    // Examiner Directory section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...colors.primary);
    doc.text('Examiner Directory', margin, 135);
    
    // Table configuration
    const tableTop = 145;
    const tableHeaders = ['Name', 'Department', 'Position', 'Expertise Areas', 'Availability'];
    const colWidths = [0.25, 0.20, 0.20, 0.25, 0.10]; // Proportions of contentWidth
    let colX = [margin];
    
    // Calculate column positions
    for (let i = 0; i < colWidths.length - 1; i++) {
      colX.push(colX[i] + colWidths[i] * contentWidth);
    }
    
    // Draw table header with gradient
    const drawHeader = (y) => {
      // Header background
      doc.setFillColor(...colors.primary);
      doc.roundedRect(margin, y - 7, contentWidth, 10, 2, 2, 'F');
      
      // Header text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...colors.white);
      
      tableHeaders.forEach((header, i) => {
        doc.text(header, colX[i] + 3, y);
      });
      
      return y + 12; // Return next Y position
    };
    
    let yPos = drawHeader(tableTop);
    
    // Function to add a new page if needed
    const checkPage = (requiredSpace = 10) => {
      if (yPos + requiredSpace > pageHeight - 25) {
        // Footer for current page
        addPageFooter();
        
        // Add new page
        doc.addPage();
        yPos = 30;
        
        // Add header on new page
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(...colors.primary);
        doc.text('Examiner Directory (continued)', margin, yPos);
        yPos += 10;
        
        // Add table header on new page
        yPos = drawHeader(yPos);
      }
      return yPos;
    };
    
    // Add page footer
    const addPageFooter = () => {
      const pageNumber = doc.internal.getNumberOfPages();
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...colors.mediumGray);
      doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
      
      // Add thin footer line
      doc.setDrawColor(...colors.mediumGray);
      doc.setLineWidth(0.2);
      doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    };
    
    // Process examiners data for table
    const formatExpertise = (areas) => {
      if (!areas || areas.length === 0) return 'N/A';
      return areas.slice(0, 2).join(', ') + (areas.length > 2 ? '...' : '');
    };
    
    const formatAvailability = (availability) => {
      if (!availability || availability.length === 0) return '0 slots';
      return `${availability.length} slots`;
    };
    
    // Add table rows with improved styling
    filteredExaminers.forEach((examiner, index) => {
      const rowHeight = 8;
      yPos = checkPage(rowHeight + 2);
      
      // Add row background for even rows
      if (index % 2 === 0) {
        doc.setFillColor(...colors.lightGray);
        doc.rect(margin, yPos - 6, contentWidth, rowHeight, 'F');
      }
      
      // Add row content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...colors.secondary);
      
      // Ensure text doesn't overflow by truncating if needed
      const truncateText = (text, maxWidth) => {
        if (!text) return 'N/A';
        if (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor < maxWidth - 10) {
          return text;
        }
        while (doc.getStringUnitWidth(text + '...') * doc.internal.getFontSize() / doc.internal.scaleFactor > maxWidth - 10) {
          text = text.substring(0, text.length - 1);
        }
        return text + '...';
      };
      
      // Draw cell contents
      doc.text(truncateText(examiner.name || 'N/A', colWidths[0] * contentWidth), colX[0] + 3, yPos);
      doc.text(truncateText(examiner.department || 'N/A', colWidths[1] * contentWidth), colX[1] + 3, yPos);
      doc.text(truncateText(examiner.position || 'N/A', colWidths[2] * contentWidth), colX[2] + 3, yPos);
      doc.text(truncateText(formatExpertise(examiner.areas_of_expertise), colWidths[3] * contentWidth), colX[3] + 3, yPos);
      doc.text(formatAvailability(examiner.availability), colX[4] + 3, yPos);
      
      // Add subtle separator line
      if (index < filteredExaminers.length - 1) {
        doc.setDrawColor(...colors.mediumGray, 0.5);
        doc.setLineWidth(0.1);
        doc.line(margin + 5, yPos + 3, pageWidth - margin - 5, yPos + 3);
      }
      
      yPos += rowHeight;
    });
    
    // Add final horizontal line with gradient effect
    drawGradientLine(yPos + 5);
    
    // Add footer information
    yPos += 15;
    yPos = checkPage();
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...colors.secondary);
    doc.text('This report was automatically generated from the Examiner Management System.', pageWidth / 2, yPos, { align: 'center' });
    
    // Add disclaimer
    yPos += 5;
    doc.setFontSize(8);
    doc.setTextColor(...colors.mediumGray);
    doc.text('For internal use only. Information contained herein is confidential.', pageWidth / 2, yPos + 5, { align: 'center' });
    
    // Add page number at bottom of all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // No page watermark
      
      // Add page footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...colors.mediumGray);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
      
      // Add thin footer line
      doc.setDrawColor(...colors.mediumGray);
      doc.setLineWidth(0.2);
      doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    }
    
    // Save the PDF
    doc.save('examiner-directory-report.pdf');
  };

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
      {/* Success Alert */}
      <Snackbar 
        open={successAlert.open} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}
        >
          {successAlert.message}
        </Alert>
      </Snackbar>

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

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGenerateReport}
          >
            Generate Report
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