import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, Card, CardContent, Divider, CircularProgress, Alert, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

const API_BASE_URL = 'http://localhost:5000/api';

const PresentationReport = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPresentations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/presentations`);
      setPresentations(res.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load scheduled presentations.');
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyScheduledReport = () => {
    const monthlyReport = {};
    presentations.forEach(p => {
      if (p.scheduled && p.date) {
        const date = new Date(p.date);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!monthlyReport[month]) monthlyReport[month] = [];
        monthlyReport[month].push(p);
      }
    });
    return monthlyReport;
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  const scheduledReport = getMonthlyScheduledReport();

  // Export to PDF
  const exportToPDF = (month, data) => {
    const doc = new jsPDF();
    doc.text(`${month} - Scheduled Presentations Report`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Group ID', 'Module', 'Technology', 'Attendees', 'Examiners']],
      body: data.map(p => [
        p.group_id, p.module, p.technology_category, p.num_attendees, p.required_examiners
      ])
    });
    doc.save(`${month}_Presentation_Report.pdf`);
  };

  // Export to CSV
  const exportToCSV = (month, data) => {
    const csv = Papa.unparse(data.map(p => ({
      GroupID: p.group_id,
      Module: p.module,
      Technology: p.technology_category,
      Attendees: p.num_attendees,
      Examiners: p.required_examiners
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${month}_Presentation_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Loading Scheduled Reports...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 6 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="contained" onClick={fetchPresentations}>Retry</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" fontWeight={700} color="#1976d2" gutterBottom>
        Monthly Scheduled Presentations Report
      </Typography>
      <Divider sx={{ mb: 5, width: '100px', mx: 'auto', borderColor: '#3f51b5', borderWidth: 2 }} />
      
      {Object.entries(scheduledReport).length === 0 ? (
        <Typography>No scheduled presentations available.</Typography>
      ) : (
        Object.entries(scheduledReport).map(([month, items]) => (
          <Card key={month} sx={{ mb: 5, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">{month}</Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" onClick={() => exportToPDF(month, items)}>Export PDF</Button>
                  <Button variant="outlined" onClick={() => exportToCSV(month, items)}>Export CSV</Button>
                </Stack>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableRow>
                      <TableCell><strong>Group ID</strong></TableCell>
                      <TableCell><strong>Module</strong></TableCell>
                      <TableCell><strong>Technology</strong></TableCell>
                      <TableCell><strong>Attendees</strong></TableCell>
                      <TableCell><strong>Examiners</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((p, i) => (
                      <TableRow key={p._id || i}>
                        <TableCell>{p.group_id}</TableCell>
                        <TableCell>{p.module}</TableCell>
                        <TableCell>{p.technology_category}</TableCell>
                        <TableCell>{p.num_attendees}</TableCell>
                        <TableCell>{p.required_examiners}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default PresentationReport;
