import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Chip,
  Button,
  Tooltip,
  Divider,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Container,
} from "@mui/material";
import {
  Search,
  Delete,
  Edit,
  ExpandMore,
  ExpandLess,
  CalendarMonth,
  Refresh,
  PersonAdd,
  FilterList,
  DisplaySettings,
  School,
} from "@mui/icons-material";
import dayjs from "dayjs";

// Function to generate random color based on string (for consistent department colors)
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#3f51b5', '#f50057', '#00a152', '#ff9800', '#2196f3', '#9c27b0', '#607d8b'];
  return colors[Math.abs(hash) % colors.length];
};

export default function ExaminerList() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [examiners, setExaminers] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  
  // Dummy Data with enhanced information and updated names
  const dummyData = [
    {
      id: 1,
      name: "Prof. Janaka Silva",
      email: "janaka.s@gmail.com",
      phone: "0771234567",
      department: "IT",
      position: "Professor",
      expertise: "Artificial Intelligence, Data Science, Database Adminstration",
      publications: 24,
      availableTimeSlots: [
        {
          date: dayjs().add(1, "day"),
          slots: [{ startTime: dayjs().hour(9).minute(0), endTime: dayjs().hour(11).minute(0) }],
        },
        {
          date: dayjs().add(3, "day"),
          slots: [{ startTime: dayjs().hour(14).minute(0), endTime: dayjs().hour(16).minute(0) }],
        },
      ],
    },
    {
      id: 2,
      name: "Dr. H.Wijesinghe",
      email: "wijesinghe.h@gmail.com",
      phone: "0789876543",
      department: "CS",
      position: "Senior Lecturer",
      expertise: "Cyber Security, Network Systems",
      publications: 17,
      availableTimeSlots: [
        {
          date: dayjs().add(2, "day"),
          slots: [{ startTime: dayjs().hour(10).minute(0), endTime: dayjs().hour(12).minute(0) }],
        },
      ],
    },
    {
      id: 4,
      name: "Dr. Sheril Perera",
      email: "sheril.p@gmail.com",
      phone: "0734567890",
      department: "CS",
      position: "Lecturer",
      expertise: "Cyber Security, Artificial Intelligence",
      publications: 19,
      availableTimeSlots: [
        {
          date: dayjs().add(3, "day"),
          slots: [{ startTime: dayjs().hour(9).minute(0), endTime: dayjs().hour(12).minute(0) }],
        },
      ],
    },
  ];

  // Get unique departments for filter
  const departments = ["All", ...new Set(dummyData.map(examiner => examiner.department))];

  useEffect(() => {
    // Immediately set data without loading state
    setExaminers(dummyData);
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleRefresh = () => {
    // Immediate refresh without loading animation
    setExaminers(dummyData);
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDepartmentFilter = (event) => {
    setDepartmentFilter(event.target.value);
  };

  // Handle navigation to Add Examiner form
  const handleAddExaminer = () => {
    navigate("/addExaminer");
  };

  // Handle navigation to edit examiner
  const handleEditExaminer = (id) => {
    // Prevent row expansion when clicking edit button
    event.stopPropagation();
    navigate(`/addExaminer?id=${id}`); // You can pass the examiner ID as a parameter
  };

  // Filter examiners based on search and department filter
  const filteredExaminers = examiners.filter(
    (examiner) => 
      (departmentFilter === "All" || examiner.department === departmentFilter) &&
      (examiner.name.toLowerCase().includes(search.toLowerCase()) ||
       examiner.email.toLowerCase().includes(search.toLowerCase()) ||
       examiner.department.toLowerCase().includes(search.toLowerCase()) ||
       examiner.expertise.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box sx={{ 
      width: '100vw',  // Use viewport width to ensure full width
      minHeight: '100vh', // Ensure it takes up at least the full viewport height
      bgcolor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mb: 4 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <School sx={{ fontSize: 40, color: '#3f51b5', mr: 2 }} />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: "bold", 
                background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '0.5px'
              }}
            >
              Examiner Directory
            </Typography>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Examiners</Typography>
                <Typography variant="h4" component="div">{examiners.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Departments</Typography>
                <Typography variant="h4" component="div">{departments.length - 1}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Availability Slots</Typography>
                <Typography variant="h4" component="div">
                  {examiners.reduce((total, examiner) => total + examiner.availableTimeSlots.length, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter bar */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Examiner"
              value={search}
              onChange={handleSearch}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center', 
            justifyContent: { xs: 'flex-start', sm: 'flex-end' } 
          }}>
            <FormControl sx={{ minWidth: '150px' }}>
              <InputLabel id="department-filter-label">Department</InputLabel>
              <Select
                labelId="department-filter-label"
                value={departmentFilter}
                label="Department"
                onChange={handleDepartmentFilter}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Tooltip title="Refresh List">
              <IconButton onClick={handleRefresh} color="primary" sx={{ boxShadow: 1 }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Add New Examiner">
              <Button 
                onClick={handleAddExaminer} // Add onClick handler here
                variant="contained" 
                color="primary" 
                startIcon={<PersonAdd />}
                sx={{ 
                  boxShadow: 2,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                }}
              >
                Add Examiner
              </Button>
            </Tooltip>
          </Grid>
        </Grid>

        {/* Results summary */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
        }}>
          <Typography variant="subtitle1">
            Showing {filteredExaminers.length} of {examiners.length} examiners
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Filter Options">
              <IconButton size="small">
                <FilterList />
              </IconButton>
            </Tooltip>
            <Tooltip title="Display Settings">
              <IconButton size="small">
                <DisplaySettings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Table with styling */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: 3,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead sx={{ 
              background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)'
            }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Examiner</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Position</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expertise</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Availability</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExaminers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1" color="textSecondary">
                      No examiners match your search criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredExaminers.map((examiner) => (
                  <React.Fragment key={examiner.id}>
                    <TableRow 
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(63, 81, 181, 0.08)'
                        },
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => handleExpandClick(examiner.id)}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {examiner.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {examiner.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={examiner.department} 
                          size="small"
                          sx={{ 
                            backgroundColor: stringToColor(examiner.department),
                            color: 'white',
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell>{examiner.position}</TableCell>
                      <TableCell>
                        <Box sx={{ maxWidth: '250px' }}>
                          {examiner.expertise.split(',').map((exp, i) => (
                            <Chip
                              key={i}
                              label={exp.trim()}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarMonth sx={{ fontSize: '1rem', mr: 1, color: '#3f51b5' }} />
                          <Typography variant="body2">
                            {examiner.availableTimeSlots.length} available slots
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit Examiner">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              sx={{ boxShadow: 1 }}
                              onClick={(event) => {
                                event.stopPropagation(); // Prevent row expansion
                                handleEditExaminer(examiner.id);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Examiner">
                            <IconButton 
                              size="small" 
                              color="error" 
                              sx={{ boxShadow: 1 }}
                              onClick={(event) => {
                                event.stopPropagation(); // Prevent row expansion
                                // Add delete functionality here
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={expandedId === examiner.id ? "Hide Details" : "Show Details"}>
                            <IconButton 
                              size="small" 
                              color="default"
                              sx={{ boxShadow: 1 }}
                            >
                              {expandedId === examiner.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded details row */}
                    {expandedId === examiner.id && (
                      <TableRow sx={{ backgroundColor: 'rgba(63, 81, 181, 0.04)' }}>
                        <TableCell colSpan={6} sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#3f51b5' }}>
                              Availability Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {examiner.availableTimeSlots.map((slot, index) => (
                                <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                                  <CardContent sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                      {dayjs(slot.date).format("dddd, MMMM D, YYYY")}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                      {slot.slots.map((time, idx) => (
                                        <Chip
                                          key={idx}
                                          label={`${dayjs(time.startTime).format("h:mm A")} - ${dayjs(time.endTime).format("h:mm A")}`}
                                          variant="outlined"
                                          color="primary"
                                          sx={{ mr: 1, mb: 1 }}
                                        />
                                      ))}
                                    </Box>
                                  </CardContent>
                                </Card>
                              ))}
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}