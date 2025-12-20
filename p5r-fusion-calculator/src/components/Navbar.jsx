import React from 'react';
import './Navbar.css';

function Navbar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'saveUpload', label: 'Upload Your Save File' },
    { id: 'inventory', label: 'My Compendium' },
    { id: 'allPersonae', label: 'All Personas' },
    { id: 'fusion', label: 'Fusion Calculator'}
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">P5R Save Tool</h1>
        <div className="navbar-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`navbar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
