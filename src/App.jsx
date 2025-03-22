import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExaminerForm from "./components/ExaminerManagement/ExaminerForm";
import ExaminerList from "./components/ExaminerManagement/ExaminerList";
import ReportsPage from "./components/Reports/ReportsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/addExaminer" element={<ExaminerForm />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/ExaminerList" element={<ExaminerList />} />
      </Routes>
    </Router>
  );
}

export default App;
