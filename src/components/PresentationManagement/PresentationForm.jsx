import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const PresentationForm = () => {
  const [formData, setFormData] = useState({
    group_id: '',
    module: '',
    num_attendees: '',
    required_examiners: '',
    technology_category: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/presentations/', formData);
      setMessage(response.data.message);
      setFormData({
        group_id: '',
        module: '',
        num_attendees: '',
        required_examiners: '',
        technology_category: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting presentation');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Add New Presentation
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
            Submit
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

export default PresentationForm;
