// ... (imports stay the same)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, CircularProgress, Alert, Box,
  Divider, Chip, Container, Card, CardContent, Tooltip,
  Grid, IconButton, Button, TextField, InputAdornment
} from '@mui/material';
import {
  Group as GroupIcon,
  Class as ClassIcon,
  PeopleAlt as PeopleAltIcon,
  PersonSearch as PersonSearchIcon,
  EventAvailable as EventAvailableIcon,
  Code as CodeIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const PresentationView = () => {
  const [presentations, setPresentations] = useState([]);
  const [filteredPresentations, setFilteredPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const fetchPresentations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/presentations`);
      setPresentations(response.data);
      setFilteredPresentations(response.data);
    } catch (err) {
      console.error('Error fetching presentations:', err);
      setError('Failed to fetch presentations. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPresentations(presentations);
    } else {
      const filtered = presentations.filter(p =>
        (p.group_id && p.group_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.module && p.module.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.technology_category && p.technology_category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPresentations(filtered);
    }
  }, [searchTerm, presentations]);

  const handleAddPresentation = () => {
    navigate('/presentationsForm');
  };

  const handleEditPresentation = (id) => {
    navigate(`/presentationsedit/${id}`);
  };

  const handleDeletePresentation = async (id) => {
    if (confirmDelete === id) {
      try {
        await axios.delete(`${API_BASE_URL}/presentations/${id}`);
        fetchPresentations();
        setConfirmDelete(null);
      } catch (err) {
        console.error('Error deleting presentation:', err);
        setError('Failed to delete presentation. Please try again.');
      }
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const getTechnologyColor = (technology) => {
    const colors = {
      'Software Development': '#b3e0ff',
      'Web Development': '#ffd6cc',
      'Mobile Apps': '#d9f2d9',
      'Artificial Intelligence': '#ffe6cc',
      'Machine Learning': '#e1bee7',
      'Data Science': '#c8e6c9',
      'Database Systems': '#bbdefb',
      'Computer Networks': '#ffecb3',
      'Cybersecurity': '#ffccbc',
      'Cloud Computing': '#b2ebf2',
      'DevOps': '#d1c4e9',
      'Game Development': '#ffcdd2'
    };
    return colors[technology] || '#e6e6fa';
  };

  const getStatusBadgeColor = (scheduled) => ({
    backgroundColor: scheduled ? '#c8e6c9' : '#fff9c4',
    color: scheduled ? '#388e3c' : '#fbc02d',
    fontWeight: 500,
    borderRadius: '12px',
    padding: '4px 12px',
    fontSize: '0.75rem',
    display: 'inline-block',
    textAlign: 'center',
    minWidth: '80px'
  });

  const getStats = () => {
    if (!presentations.length) return {
      totalPresentations: 0,
      totalExaminersNeeded: 0,
      mostCommonTechnology: 'N/A',
      totalAttendees: 0
    };

    const techCount = {};
    let totalExaminers = 0;
    let totalAttendees = 0;
    let mostCommon = { name: '', count: 0 };

    presentations.forEach(p => {
      if (p.technology_category) {
        techCount[p.technology_category] = (techCount[p.technology_category] || 0) + 1;
        if (techCount[p.technology_category] > mostCommon.count) {
          mostCommon = { name: p.technology_category, count: techCount[p.technology_category] };
        }
      }
      totalExaminers += p.required_examiners || 0;
      totalAttendees += p.num_attendees || 0;
    });

    return {
      totalPresentations: presentations.length,
      totalExaminersNeeded: totalExaminers,
      mostCommonTechnology: mostCommon.name,
      totalAttendees: totalAttendees
    };
  };

  const getMonthlyScheduledReport = () => {
    const monthlyReport = {};

    presentations.forEach(p => {
      if (p.scheduled && p.date) {
        const date = new Date(p.date);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        if (!monthlyReport[month]) {
          monthlyReport[month] = [];
        }

        monthlyReport[month].push(p);
      }
    });

    return monthlyReport;
  };

  const stats = getStats();
  const scheduledReport = getMonthlyScheduledReport();

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: '#666' }}>Loading presentation data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 6, mx: 'auto', maxWidth: 600 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2, boxShadow: 3 }}>
          {error}
        </Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="contained" onClick={fetchPresentations}>Try Again</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 6, mb: 8 }}>
        <Typography variant="h3" align="center" fontWeight={700} color="#1976d2" gutterBottom>
          Presentation Scheduler
        </Typography>

        <Divider sx={{ mb: 5, width: '100px', mx: 'auto', borderColor: '#3f51b5', borderWidth: 2 }} />

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<EventAvailableIcon fontSize="large" color="primary" />} value={stats.totalPresentations} label="Total Presentations" bg="#bbdefb" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<PersonSearchIcon fontSize="large" sx={{ color: '#388e3c' }} />} value={stats.totalExaminersNeeded} label="Total Examiners Needed" bg="#c8e6c9" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<CodeIcon fontSize="large" sx={{ color: '#f57c00' }} />} value={stats.mostCommonTechnology} label="Most Common Technology" bg="#ffecb3" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<PeopleAltIcon fontSize="large" sx={{ color: '#7b1fa2' }} />} value={stats.totalAttendees} label="Total Attendees" bg="#e1bee7" />
          </Grid>
        </Grid>
        

        {/* Search & Add */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddPresentation}
            sx={{
              borderRadius: 2, px: 3, py: 1,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
              }
            }}
          >
            Add New Presentation
          </Button>

          <Button
          variant="contained"
          onClick={() => navigate('/presentation-report')}
          sx={{
            borderRadius: 2, px: 3, py: 1,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
            }
          }}
          >
          View Monthly Presentation Reports
        </Button>
          <TextField
            variant="outlined"
            placeholder="Search presentations"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>
            }}
            sx={{ maxWidth: 900 }}
          />
        </Box>

        {/* Table */}
        <Card elevation={6} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e8eaf6' }}>
                    <StyledHeaderCell icon={<GroupIcon />} label="Group ID" />
                    <StyledHeaderCell icon={<ClassIcon />} label="Module" />
                    <StyledHeaderCell icon={<PeopleAltIcon />} label="Attendees" />
                    <StyledHeaderCell icon={<PersonSearchIcon />} label="Required Examiners" />
                    <StyledHeaderCell icon={<CodeIcon />} label="Technology" />
                    <StyledHeaderCell icon={<EventAvailableIcon />} label="Status" />
                    <StyledHeaderCell label="Actions" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPresentations.map((p, i) => (
                    <TableRow key={p._id} sx={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                      <TableCell>{p.group_id}</TableCell>
                      <TableCell>{p.module}</TableCell>
                      <TableCell align="center">{p.num_attendees}</TableCell>
                      <TableCell align="center">{p.required_examiners}</TableCell>
                      <TableCell>
                        <Chip label={p.technology_category} size="small" sx={{ backgroundColor: getTechnologyColor(p.technology_category) }} />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={getStatusBadgeColor(p.scheduled)}>
                          {p.scheduled ? "Scheduled" : "Pending"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Edit">
                            <IconButton color="primary" onClick={() => handleEditPresentation(p._id)}><EditIcon /></IconButton>
                          </Tooltip>
                          <Tooltip title={confirmDelete === p._id ? "Click again to confirm" : "Delete"}>
                            <IconButton color={confirmDelete === p._id ? "error" : "default"} onClick={() => handleDeletePresentation(p._id)}><DeleteIcon /></IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

      </Box>
    </Container>
  );
};

const StatCard = ({ icon, value, label, bg }) => (
  <Card sx={{ borderRadius: 2, background: bg }}>
    <CardContent sx={{ textAlign: 'center', py: 3 }}>
      {icon}
      <Typography variant="h4" fontWeight="bold">{value}</Typography>
      <Typography variant="subtitle1" color="text.secondary">{label}</Typography>
    </CardContent>
  </Card>
);

const StyledHeaderCell = ({ icon, label }) => (
  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon && React.cloneElement(icon, { sx: { mr: 1, color: '#3f51b5' } })}
      <Typography variant="subtitle1" fontWeight="bold">{label}</Typography>
    </Box>
  </TableCell>
);

export default PresentationView;
