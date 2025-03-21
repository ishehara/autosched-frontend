import React from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { Group, Code, Build, People, Person, AddCircleOutline } from "@mui/icons-material";

// ✅ Validation Schema using Yup for PresentationForm with additional validations
const PresentationSchema = Yup.object().shape({
  groupid: Yup.string().required("Group ID is required"),
  modulecode: Yup.string()
    .required("Module Code is required")
    .matches(
      /^[A-Z]{2}[0-9]{4}$/,
      "Module code must be 6 characters: 2 uppercase letters followed by 4 digits"
    ),
  techSpecification: Yup.string().required("Technical specification is required"),
  noOfAttendees: Yup.number()
    .min(1, "Number of attendees must be greater than zero")
    .required("Number of attendees is required"),
  noOfrequiredExaminers: Yup.number()
    .min(1, "Number of required examiners must be greater than zero")
    .required("Number of required examiners is required"),
});

const PresentationForm = ({ fetchPresentations }) => {
  // Generate an array of numbers 1 to 10 for the dropdown options
  const numberOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    
    <Paper elevation={6} sx={{ 
      maxWidth: 1000, 
      margin: "auto", 
      mt: 4, 
      mb: 4,
      mr: 50,
      ml: 50,
      borderRadius: 1,
      overflow: "hidden",
    }}>
      
      <Box sx={{ 
        p: 3,
        background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
        color: "white",
      }}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
          <AddCircleOutline sx={{ mr: 1 }} />
          Add New Presentation
        </Typography>
      </Box>
      
      <Box sx={{ p: 3 }}>
        <Formik
          initialValues={{
            groupid: "",
            modulecode: "",
            techSpecification: "",
            noOfAttendees: 1,
            noOfrequiredExaminers: 1,
          }}
          validationSchema={PresentationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await axios.post("http://localhost:5000/api/presentations", values);
              alert("Presentation added successfully!");
              resetForm();
              fetchPresentations(); // Refresh presentation list
            } catch (error) {
              console.error("Error submitting data:", error);
              alert("Failed to add presentation.");
            }
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: "500" }}>
                    Presentation Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Group ID */}
                <Grid item xs={12} md={6}>
                  <TextField
                    name="groupid"
                    label="Group ID"
                    fullWidth
                    variant="outlined"
                    value={values.groupid}
                    onChange={handleChange}
                    error={touched.groupid && !!errors.groupid}
                    helperText={touched.groupid && errors.groupid}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Group color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Module Code */}
                <Grid item xs={12} md={6}>
                  <TextField
                    name="modulecode"
                    label="Module Code"
                    fullWidth
                    variant="outlined"
                    value={values.modulecode}
                    onChange={handleChange}
                    error={touched.modulecode && !!errors.modulecode}
                    helperText={touched.modulecode && errors.modulecode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Code color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Technical Specification */}
                <Grid item xs={12}>
                  <TextField
                    name="techSpecification"
                    label="Technical Specification"
                    fullWidth
                    variant="outlined"
                    value={values.techSpecification}
                    onChange={handleChange}
                    error={touched.techSpecification && !!errors.techSpecification}
                    helperText={touched.techSpecification && errors.techSpecification}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Build color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Number of Attendees (Dropdown) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    name="noOfAttendees"
                    label="Number of Attendees"
                    fullWidth
                    variant="outlined"
                    value={values.noOfAttendees}
                    onChange={handleChange}
                    error={touched.noOfAttendees && !!errors.noOfAttendees}
                    helperText={touched.noOfAttendees && errors.noOfAttendees}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <People color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {numberOptions.map((number) => (
                      <MenuItem key={number} value={number}>
                        {number}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Number of Required Examiners (Dropdown) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    name="noOfrequiredExaminers"
                    label="Number of Required Examiners"
                    fullWidth
                    variant="outlined"
                    value={values.noOfrequiredExaminers}
                    onChange={handleChange}
                    error={touched.noOfrequiredExaminers && !!errors.noOfrequiredExaminers}
                    helperText={touched.noOfrequiredExaminers && errors.noOfrequiredExaminers}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {numberOptions.map((number) => (
                      <MenuItem key={number} value={number}>
                        {number}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    size="large"
                    sx={{ 
                      mt: 3, 
                      py: 1.2,
                      borderRadius: 1,
                      background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                      color: "white",
                      textTransform: "none",
                      fontWeight: "bold",
                      boxShadow: '0 2px 4px rgba(25, 118, 210, 0.3)',
                    }}
                    startIcon={<AddCircleOutline />}
                  >
                    Add Presentation
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Paper>
  );
};

PresentationForm.propTypes = {
  fetchPresentations: PropTypes.func.isRequired,
};

export default PresentationForm;