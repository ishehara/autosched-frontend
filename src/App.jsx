import React from "react";

import { BrowserRouter , Routes, Route } from "react-router-dom";
import './App.css'
import NavBar from "./components/Pages/NavBar";
import Footer from "./components/Pages/Footer";
import Home from "./components/Pages/Home";
import VenueForm from './components/VenueManagement/VenueForm';
import Dashboard from "./components/Pages/Dashboard";
import VenueList from "./components/VenueManagement/VenueList";
import UpdateVenueForm from "./components/VenueManagement/UpdateVenueForm";
import ExaminerForm from "./components/ExaminerManagement/ExaminerForm";
import ExaminerList from "./components/ExaminerManagement/ExaminerList";
import EditExaminer from "./components/ExaminerManagement/EditExaminer";
import ReportsPage from "./components/Reports/ReportsPage";
import LoginForm from "./components/Pages/LoginForm";
import PresentationView from "./components/PresentationManagement/PresentationView";
import PresentationForm from "./components/PresentationManagement/PresentationForm";
import EditPresentation from "./components/PresentationManagement/EditPresentation";
import PresentationReport from "./components/PresentationManagement/PresentationReport";

import AIScheduler from "./components/AIScheduler/AIScheduler";


function App() {
  return (
    <BrowserRouter> {/* ✅ Fix: Use BrowserRouter instead of Router */}
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/addVenue" element={<VenueForm />} /> {/* ✅ Check the path here */}
        <Route path="/VenueList" element={<VenueList />} /> {/* ✅ Check the path here */}
        <Route path="/UpdateVenueForm/:venueId" element={<UpdateVenueForm />} /> {/* ✅ Check the path here */}

        {/* Route to view login form at the root */}
        <Route path="/login" element={<LoginForm />} />

        {/* Route to view all presentations */}
        <Route path="/presentations" element={<PresentationView />} />

        {/* Route to add a new presentation */}
        <Route path="/presentationsForm" element={<PresentationForm />} />

        {/* Route to edit an existing presentation */}
        <Route path="/presentationsedit/:id" element={<EditPresentation />} />

        {/* Route to view the presentation report */} 
        <Route path="/presentation-report" element={<PresentationReport />} />

        <Route path="/AIScheduler" element={<AIScheduler />} /> {/* ✅ Check the path here */}
  
        <Route path="/addExaminer" element={<ExaminerForm />} />
        <Route path="/editExaminer/:id" element={<EditExaminer />} />
        <Route path="/ExaminerList" element={<ExaminerList />} />

      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>

  );
}

export default App;
