import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePersonas } from '../contexts/PersonaContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { saveMetaData } = usePersonas();

  const tabs = [
    { path: '/', label: saveMetaData && saveMetaData.inGameDay ? 'Save File' : 'Upload Your Save File' },
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
        {saveMetaData && saveMetaData.playerLevel && (
          <div className="save-indicator">
            <div className="save-indicator-label">Current Save</div>
            <div className="save-indicator-value">
              Lv. {saveMetaData.playerLevel} • {saveMetaData.playTime}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
