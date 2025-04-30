// src/components/AIScheduler/AIScheduler.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Tooltip,
  Snackbar
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  DateRange as DateRangeIcon,
  MailOutline as MailIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const API_BASE_URL = 'http://localhost:5000/api';

const AIScheduler = () => {
  // State for presentations
  const [presentations, setPresentations] = useState([]);
  const [scheduledPresentations, setScheduledPresentations] = useState([]);
  const [unscheduledPresentations, setUnscheduledPresentations] = useState([]);
  
  // State for scheduling
  const [dateRange, setDateRange] = useState([null, null]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  
  // State for emails
  const [sendingEmails, setSendingEmails] = useState(false);
  
  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for metadata
  const [examiners, setExaminers] = useState({});
  const [venues, setVenues] = useState({});
  
  // Stats
  const [stats, setStats] = useState({
    totalScheduled: 0,
    totalPending: 0,
    totalExaminerAssignments: 0,
    moduleBreakdown: {}
  });
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);
  
  // Separate presentations into scheduled and unscheduled
  useEffect(() => {
    if (presentations.length > 0) {
      const scheduled = presentations.filter(p => p.scheduled);
      const unscheduled = presentations.filter(p => !p.scheduled);
      
      setScheduledPresentations(scheduled);
      setUnscheduledPresentations(unscheduled);
      
      // Update stats
      calculateStats(scheduled, unscheduled);
    }
  }, [presentations]);

  // Fetch all required data from the API
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch presentations, examiners and venues in parallel
      const [presentationsRes, examinersRes, venuesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/presentations`),
        axios.get(`${API_BASE_URL}/examiners`),
        axios.get(`${API_BASE_URL}/venues`)
      ]);
      
      setPresentations(presentationsRes.data);
      
      // Convert examiners array to a map for easier lookup
      const examinersMap = {};
      examinersRes.data.forEach(examiner => {
        examinersMap[examiner._id] = examiner;
      });
      setExaminers(examinersMap);
      
      // Convert venues array to a map for easier lookup
      const venuesMap = {};
      venuesRes.data.forEach(venue => {
        venuesMap[venue._id] = venue;
      });
      setVenues(venuesMap);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please check your connection to the backend server.');
      setLoading(false);
    }
  };

  // Calculate statistics for presentations
  const calculateStats = (scheduled, unscheduled) => {
    // Create module breakdown
    const moduleBreakdown = {};
    
    // Count scheduled presentations by module
    scheduled.forEach(presentation => {
      const module = presentation.module || 'Unknown';
      moduleBreakdown[module] = (moduleBreakdown[module] || 0) + 1;
    });
    
    // Count examiner assignments
    let totalExaminerAssignments = 0;
    scheduled.forEach(presentation => {
      totalExaminerAssignments += (presentation.examiner_ids?.length || 0);
    });
    
    setStats({
      totalScheduled: scheduled.length,
      totalPending: unscheduled.length,
      totalExaminerAssignments,
      moduleBreakdown
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString;
    }
  };

  // Get examiner names for a presentation
  const getExaminerNames = (examinerIds) => {
    if (!examinerIds || examinerIds.length === 0) return 'No examiners assigned';
    
    return examinerIds.map(id => {
      const examiner = examiners[id];
      return examiner ? examiner.name : 'Unknown Examiner';
    }).join(', ');
  };

  // Get venue name for a presentation
  const getVenueName = (venueId) => {
    if (!venueId) return 'No venue assigned';
    
    const venue = venues[venueId];
    return venue ? venue.venue_name : 'Unknown Venue';
  };

  // Handle scheduling presentations
  const handleSchedule = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      setSnackbar({
        open: true,
        message: 'Please select both start and end dates',
        severity: 'error'
      });
      return;
    }
    
    setIsScheduling(true);
    
    try {
      // Format the date range as strings in YYYY-MM-DD format
      // This is critical for proper backend API consumption
      const formattedDateRange = [
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD')
      ];
      
      console.log('Sending schedule request with date range:', formattedDateRange);
      
      // Ensure the data structure matches exactly what the backend expects
      const response = await axios.post(`${API_BASE_URL}/presentations/schedule`, {
        date_range: formattedDateRange
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Schedule response:', response.data);
      
      if (response.data && response.data.scheduled_presentations) {
        // Refresh presentation data
        await fetchAllData();
        
        setSnackbar({
          open: true,
          message: `Successfully scheduled ${response.data.scheduled_presentations.length} presentations`,
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error scheduling presentations:', err);
      setSnackbar({
        open: true,
        message: `Failed to schedule presentations: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    } finally {
      setIsScheduling(false);
      setShowScheduleDialog(false);
    }
  };

  // Handle sending emails to examiners
  const handleSendEmails = async () => {
    setSendingEmails(true);
    
    try {
      // For demonstration, we'll just show a success message
      // In a real implementation, you would call the email endpoint from your backend
      // await axios.post(`${API_BASE_URL}/emails/send-examiner-schedules`);
      
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: 'Email notifications sent to all examiners',
          severity: 'success'
        });
        setSendingEmails(false);
      }, 2000);
    } catch (err) {
      console.error('Error sending emails:', err);
      setSnackbar({
        open: true,
        message: 'Failed to send email notifications. Please try again.',
        severity: 'error'
      });
      setSendingEmails(false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh' 
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading scheduler data...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2, 
            boxShadow: 3, 
            p: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ErrorIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6">Error Loading Data</Typography>
            <Typography variant="body1">{error}</Typography>
          </Box>
        </Alert>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={fetchAllData}
            startIcon={<RefreshIcon />}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ mt: 8, mb: 8 }}>
        {/* Header */}
        <Paper 
          elevation={4} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(to right, #3f51b5, #5c6bc0)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ScheduleIcon sx={{ fontSize: 36, mr: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              AI-Powered Presentation Scheduler
            </Typography>
          </Box>
          <Typography variant="subtitle1">
            View scheduled presentations and automatically schedule pending presentations
          </Typography>
        </Paper>
        
        {/* Stats Section */}
        <Grid container spacing={8} sx={{ mb: 4, justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3, width: '300px' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {stats.totalScheduled}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Presentations Scheduled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={1.5} display={{ xs: 'none', md: 'block' }} />
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3, width: '300px' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {stats.totalPending}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Presentations Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4, 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ScheduleIcon />}
            onClick={() => setShowScheduleDialog(true)}
            disabled={unscheduledPresentations.length === 0}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 2,
              boxShadow: 3,
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
          >
            Schedule Presentations ({unscheduledPresentations.length})
          </Button>
          
          
        </Box>
        
        {/* Scheduled Presentations Table */}
        <Paper elevation={4} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'primary.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CalendarIcon sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Scheduled Presentations
            </Typography>
          </Box>
          
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Group ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Module</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Venue</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Examiners</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Technology</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduledPresentations.length > 0 ? (
                  scheduledPresentations.map((presentation) => (
                    <TableRow 
                      key={presentation._id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                        '&:hover': { backgroundColor: '#f1f8ff' }
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="medium">{presentation.group_id}</Typography>
                      </TableCell>
                      <TableCell>{presentation.module}</TableCell>
                      <TableCell>{formatDate(presentation.date)}</TableCell>
                      <TableCell>{`${presentation.start_time} - ${presentation.end_time}`}</TableCell>
                      <TableCell>{getVenueName(presentation.venue_id)}</TableCell>
                      <TableCell>
                        <Tooltip title={getExaminerNames(presentation.examiner_ids)}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {presentation.examiner_ids?.map((id, index) => (
                              <Chip
                                key={index}
                                label={examiners[id]?.name?.split(' ')[0] || 'Unknown'}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={presentation.technology_category} 
                          size="small"
                          color="info"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No presentations have been scheduled yet.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => setShowScheduleDialog(true)}
                        sx={{ mt: 2 }}
                        disabled={unscheduledPresentations.length === 0}
                      >
                        Schedule Now
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        
        {/* Unscheduled Presentations */}
        {unscheduledPresentations.length > 0 && (
          <Paper elevation={4} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'warning.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CalendarIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Pending Presentations
              </Typography>
            </Box>
            
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Group ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Module</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Attendees</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Required Examiners</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Technology</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unscheduledPresentations.map((presentation) => (
                    <TableRow 
                      key={presentation._id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                        '&:hover': { backgroundColor: '#fff9c4' }
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="medium">{presentation.group_id}</Typography>
                      </TableCell>
                      <TableCell>{presentation.module}</TableCell>
                      <TableCell>{presentation.num_attendees}</TableCell>
                      <TableCell>{presentation.required_examiners}</TableCell>
                      <TableCell>
                        <Chip 
                          label={presentation.technology_category} 
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Schedule Dialog */}
        <Dialog
          open={showScheduleDialog}
          onClose={() => !isScheduling && setShowScheduleDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
            Schedule Presentations
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1" paragraph>
              The AI scheduler will automatically assign examiners to presentations based on their expertise 
              and availability, and find suitable venues for each presentation.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Please select the date range for scheduling. The system will only consider available time slots within this range.
            </Alert>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2,
              mb: 2
            }}>
              <DatePicker
                label="Start Date"
                value={dateRange[0]}
                onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    helperText: "Start of scheduling period"
                  }
                }}
              />
              
              <DatePicker
                label="End Date"
                value={dateRange[1]}
                onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                disablePast
                minDate={dateRange[0]}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    helperText: "End of scheduling period"
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setShowScheduleDialog(false)}
              disabled={isScheduling}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSchedule}
              disabled={isScheduling || !dateRange[0] || !dateRange[1]}
              startIcon={isScheduling ? <CircularProgress size={20} /> : <ScheduleIcon />}
            >
              {isScheduling ? 'Scheduling...' : 'Schedule Presentations'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default AIScheduler;