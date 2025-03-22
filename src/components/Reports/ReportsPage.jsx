import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  useTheme
} from "@mui/material";
import { 
  Download as DownloadIcon, 
  FilterAlt as FilterIcon,
  Assessment as AssessmentIcon,
  Clear as ClearIcon 
} from "@mui/icons-material";

const ReportsPage = () => {
  const theme = useTheme();
  
  // Sample Data
  const [reports, setReports] = useState([
    { id: 1, type: "Examiner Allocation", date: "2025-03-15", status: "Generated" },
    { id: 2, type: "Room Usage", date: "2025-03-16", status: "Pending" },
    { id: 3, type: "Presentation Schedules", date: "2025-03-17", status: "Generated" },
  ]);

  // Filters
  const [reportType, setReportType] = useState("");
  const [date, setDate] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Clear all filters
  const clearFilters = () => {
    setReportType("");
    setDate("");
  };

  // Filtered reports
  const filteredReports = reports.filter(
    (report) =>
      (reportType ? report.type === reportType : true) &&
      (date ? report.date === date : true)
  );

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Generated":
        return "success";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ 
      width: "100vw", 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      overflow: "hidden",
      bgcolor: "#f5f7fa" // Light background to make table stand out
    }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: theme.palette.primary.main,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AssessmentIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" fontWeight="bold">
            Reports
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="secondary"
          startIcon={<FilterIcon />}
          onClick={() => setFiltersVisible(!filtersVisible)}
          sx={{ 
            bgcolor: "rgba(255, 255, 255, 0.2)",
            '&:hover': {
              bgcolor: "rgba(255, 255, 255, 0.3)",
            }
          }}
        >
          {filtersVisible ? "Hide Filters" : "Show Filters"}
        </Button>
      </Box>

      {/* Filters */}
      {filtersVisible && (
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: "white",
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <TextField
            select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="outlined"
            size="small"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Examiner Allocation">Examiner Allocation</MenuItem>
            <MenuItem value="Room Usage">Room Usage</MenuItem>
            <MenuItem value="Presentation Schedules">Presentation Schedules</MenuItem>
          </TextField>

          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
          >
            Clear
          </Button>
          
          {(reportType || date) && (
            <Box sx={{ display: "flex", gap: 1, flexGrow: 1, flexWrap: "wrap" }}>
              {reportType && (
                <Chip 
                  label={`Type: ${reportType}`} 
                  onDelete={() => setReportType("")}
                  size="small"
                />
              )}
              {date && (
                <Chip 
                  label={`Date: ${formatDate(date)}`} 
                  onDelete={() => setDate("")}
                  size="small"
                />
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Main content area */}
      <Box sx={{ 
        p: 3,
        flexGrow: 1, 
        overflow: "auto", 
        display: "flex", 
        flexDirection: "column" 
      }}>
        {/* Table Container with shadow for prominence */}
        <Paper elevation={8} sx={{ 
          flexGrow: 1, 
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}>
          {/* Table header/title bar */}
          <Box sx={{ 
            bgcolor: theme.palette.primary.light,
            color: "white",
            px: 3,
            py: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Typography variant="h6" fontWeight="bold">
              Reports Data
            </Typography>
            <Typography variant="body2">
              {filteredReports.length} {filteredReports.length === 1 ? "record" : "records"} found
            </Typography>
          </Box>

          {/* Table - Fills all available space */}
          <TableContainer sx={{ 
            flexGrow: 1, 
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[400],
              borderRadius: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: theme.palette.grey[200],
            },
          }}>
            <Table stickyHeader sx={{ minWidth: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: "bold", 
                      bgcolor: theme.palette.grey[100],
                      fontSize: "1.1rem",
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      py: 2
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: "bold", 
                      bgcolor: theme.palette.grey[100],
                      fontSize: "1.1rem",
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      py: 2
                    }}
                  >
                    Report Type
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: "bold", 
                      bgcolor: theme.palette.grey[100],
                      fontSize: "1.1rem",
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      py: 2
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: "bold", 
                      bgcolor: theme.palette.grey[100],
                      fontSize: "1.1rem",
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      py: 2
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: "bold", 
                      bgcolor: theme.palette.grey[100],
                      fontSize: "1.1rem",
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      py: 2
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <TableRow 
                      key={report.id}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: theme.palette.action.hover,
                          boxShadow: `inset 0 0 0 1px ${theme.palette.primary.light}`
                        },
                        transition: 'all 0.2s ease',
                        height: 80,  // Larger row height
                        bgcolor: index % 2 === 0 ? 'white' : theme.palette.grey[50], // Zebra striping
                        borderBottom: `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <TableCell sx={{ fontSize: "1.1rem", fontWeight: 500 }}>{report.id}</TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium" sx={{ fontSize: "1.1rem" }}>
                          {report.type}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.1rem" }}>{formatDate(report.date)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={report.status} 
                          color={getStatusColor(report.status)}
                          sx={{ 
                            fontWeight: "bold", 
                            fontSize: "0.95rem",
                            py: 0.5,
                            px: 0.5
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={report.status === "Pending"}
                          startIcon={<DownloadIcon />}
                          onClick={() => alert(`Downloading ${report.type} Report`)}
                          sx={{ 
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            '&:hover': {
                              boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
                            },
                            '&:disabled': {
                              bgcolor: theme.palette.action.disabledBackground,
                              color: theme.palette.action.disabled
                            },
                            py: 1,
                            px: 2,
                            textTransform: "none",
                            fontSize: "0.95rem"
                          }}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                      <Typography variant="h6" color="text.secondary">
                        No reports match your filters
                      </Typography>
                      <Button 
                        variant="text" 
                        color="primary" 
                        onClick={clearFilters}
                        sx={{ mt: 2 }}
                      >
                        Clear Filters
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReportsPage;