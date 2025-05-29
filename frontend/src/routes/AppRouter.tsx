import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage.tsx';
import LabReportPage from '../pages/LabReportPage.tsx';
import Navbar from '../components/Navbar.tsx';

const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/lab-report" element={<LabReportPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default AppRouter; 