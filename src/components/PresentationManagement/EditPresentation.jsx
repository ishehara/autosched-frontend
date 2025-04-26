import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

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

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/presentations/${id}`);
        const data = response.data;
        setFormData({
          group_id: data.group_id || '',
          module: data.module || '',
          num_attendees: data.num_attendees || '',
          required_examiners: data.required_examiners || '',
          technology_category: data.technology_category || ''
        });
      } catch (error) {
        console.error('Error fetching presentation:', error);
        setMessage('Failed to fetch presentation details');
      }
    };

    fetchPresentation();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/presentations/${id}`, formData);
      setMessage('Presentation updated successfully!');
      setTimeout(() => navigate('/presentations'), 1500); // Go back after success
    } catch (error) {
      console.error('Error updating presentation:', error);
      setMessage('Failed to update presentation');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Edit Presentation
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Group ID"
            name="group_id"
            value={formData.group_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Module"
            name="module"
            value={formData.module}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Number of Attendees"
            name="num_attendees"
            type="number"
            value={formData.num_attendees}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Required Examiners"
            name="required_examiners"
            type="number"
            value={formData.required_examiners}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Technology Category"
            name="technology_category"
            value={formData.technology_category}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Update Presentation
          </Button>
        </form>
        {message && (
          <Typography color="primary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default EditPresentation;
