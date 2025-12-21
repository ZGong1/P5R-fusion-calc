import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  const tabs = [
    { path: '/', label: 'Upload Your Save File' },
    { path: '/inventory', label: 'My Compendium' },
    { path: '/all-personas', label: 'All Personas' },
    { path: '/fusion', label: 'Fusion Calculator'}
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">P5R Save Tool</h1>
        <div className="navbar-tabs">
          {tabs.map(tab => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`navbar-tab ${pathname === tab.path ? 'active' : ''}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
