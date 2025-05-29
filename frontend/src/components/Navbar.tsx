import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-logo">SHIELD Longevity</div>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
        <Link to="/lab-report" className={location.pathname === '/lab-report' ? 'active' : ''}>Lab Report</Link>
      </div>
    </nav>
  );
};

export default Navbar; 