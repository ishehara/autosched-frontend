import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, AddCircleOutline, Search } from "@mui/icons-material";

const PresentationView = () => {
  const navigate = useNavigate();

  // Dummy data for illustration; you can replace this with API data if needed.
  const [dummyData, setDummyData] = useState([
    {
      _id: "1",
      groupid: "Group A",
      modulecode: "IT3010",
      techSpecification: "Cloud Computing",
      noOfAttendees: 4,
      noOfrequiredExaminers: 1,
    },
    {
      _id: "2",
      groupid: "Group B",
      modulecode: "IE4020",
      techSpecification: "Computer Networks",
      noOfAttendees: 5,
      noOfrequiredExaminers: 2,
    },
    {
      _id: "3",
      groupid: "Group C",
      modulecode: "IT1020",
      techSpecification: "Web Development",
      noOfAttendees: 6,
      noOfrequiredExaminers: 3,
    },
  ]);

  // Delete a presentation by its id
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/presentations/${id}`);
      alert("Presentation deleted successfully!");
      // Update local state by filtering out the deleted presentation
      setDummyData(dummyData.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting presentation:", error);
      alert("Failed to delete presentation.");
    }
  };

  // (Optional) Handler for searching/filtering presentations
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    console.log("Searching for:", searchTerm);
    // Implement your search logic or filtering here if needed
  };

  return (
    <Box sx={{  bgcolor: "#f5f5f5", mr: 35 , ml: 40, mt: 10}}>
      {/* Top Header Bar similar to Reports page */}
      <Box
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "4px 4px 0 0",
          mt: 6,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center",px: 1 , py: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mr: 2 }}>
            Presentations
          </Typography>
        </Box>
      </Box>

      {/* Data Section */}
      <Paper elevation={3} sx={{ borderRadius: "4px", overflow: "hidden" }}>
        {/* Data Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#42a5f5",
            color: "white",
          }}
        >
          <Typography variant="h6">Presentations Data</Typography>
          <Typography variant="body2">{dummyData.length} records found</Typography>
        </Box>

        {/* Action Bar */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
            bgcolor: "white",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center"}}>
            <TextField
              size="medium"
              variant="outlined"
              placeholder="Search"
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            onClick={() => navigate("/presentations/new")}
          >
            Add Presentation
          </Button>
        </Box>

        {/* Table of presentations */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Group ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Module Code</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Technical Specification
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  No. of Attendees
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  No. of Required Examiners
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dummyData.map((presentation) => (
                <TableRow key={presentation._id}>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {presentation.groupid}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID: {presentation._id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={presentation.modulecode}
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>{presentation.techSpecification}</TableCell>

                  <TableCell>{presentation.noOfAttendees}</TableCell>

                  <TableCell>{presentation.noOfrequiredExaminers}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/presentations/edit/${presentation._id}`)
                      }
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(presentation._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PresentationView;