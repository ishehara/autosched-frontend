import React from "react";

import { BrowserRouter , Routes, Route } from "react-router-dom";
import './App.css'
import NavBar from "./components/Pages/NavBar";
import Footer from "./components/Pages/Footer";
import Home from "./components/Pages/Home";
import VenueForm from './components/VenueManagement/VenueForm';
import Dashboard from "./components/Pages/Dashboard";
import VenueList from "./components/VenueManagement/VenueList";
import ExaminerForm from "./components/ExaminerManagement/ExaminerForm";
import ExaminerList from "./components/ExaminerManagement/ExaminerList";
import ReportsPage from "./components/Reports/ReportsPage";
import LoginForm from "./components/Pages/LoginForm";
import PresentationView from "./components/PresentationManagement/PresentationView";
import PresentationForm from "./components/PresentationManagement/PresentationForm";
import EditPresentation from "./components/PresentationManagement/EditPresentation";

import AIScheduler from "./components/AIScheduler/AIScheduler";


function App() {
  return (
    <BrowserRouter> {/* ✅ Fix: Use BrowserRouter instead of Router */}
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/addVenue" element={<VenueForm />} /> {/* ✅ Check the path here */}
        <Route path="/VenueList" element={<VenueList />} /> {/* ✅ Check the path here */}

        {/* Route to view login form at the root */}
        <Route path="/login" element={<LoginForm />} />

        {/* Route to view all presentations */}
        <Route path="/presentations" element={<PresentationView />} />

        {/* Route to add a new presentation */}
        <Route path="/presentations/new" element={<PresentationForm />} />

        {/* Route to edit an existing presentation */}
        <Route path="/presentations/edit/:id" element={<EditPresentation />} />

        <Route path="/AIScheduler" element={<AIScheduler />} /> {/* ✅ Check the path here */}
  
        <Route path="/addExaminer" element={<ExaminerForm />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/ExaminerList" element={<ExaminerList />} />

      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
\
  );
}

export default App;
