import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import NavBar from "./components/Pages/NavBar";
import Footer from "./components/Pages/Footer";
import Home from "./components/Pages/Home";
import VenueForm from './components/VenueManagement/VenueForm';
import Dashboard from "./components/Pages/Dashboard";
import VenueList from "./components/VenueManagement/VenueList";
import AIScheduler from "./components/AIScheduler/AIScheduler";


function App() {
  return (
    <BrowserRouter> {/* ✅ Fix: Use BrowserRouter instead of Router */}
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/addVenue" element={<VenueForm />} /> {/* ✅ Check the path here */}
        <Route path="/VenueList" element={<VenueList />} /> {/* ✅ Check the path here */}
        <Route path="/AIScheduler" element={<AIScheduler />} /> {/* ✅ Check the path here */}
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
