import React, { useState, useEffect } from 'react';
import { personaMap } from '../fusion-calculator-core/data/PersonaDataRoyal.js';
import './PersonaInventory.css';

function PersonaInventory({ personas, onClear, setActiveTab, setSelectedPersona }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'level', 'arcana'
  const [filterArcana, setFilterArcana] = useState('all');

  // Get unique arcanas from personas for the filter dropdown
  const allArcanas = personas.map(p => getPersonaData(p.name)?.arcana);
  const validArcanas = allArcanas.filter(Boolean); // Remove null/undefined
  const uniqueArcanaSet = new Set(validArcanas); // Set removes duplicates
  const arcanas = Array.from(uniqueArcanaSet).sort(); // Convert Set to Array and sort

  // Enrich persona with additional data from PersonaDataRoyal
  function getPersonaData(name) {
    return personaMap[name] || null;
  }

  // Filter and sort personas
  const filteredPersonas = personas
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const personaData = getPersonaData(p.name);
      const matchesArcana = filterArcana === 'all' || personaData?.arcana === filterArcana;
      return matchesSearch && matchesArcana;
    })
    .sort((a, b) => {
      const aData = getPersonaData(a.name);
      const bData = getPersonaData(b.name);

      if (sortBy === 'level') {
        return (aData?.level || 0) - (bData?.level || 0);
      } else if (sortBy === 'arcana') {
        return (aData?.arcana || '').localeCompare(bData?.arcana || '');
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  /*
  * For if persona inventory is empty:
  * I don't believe its possible to get a save file without a persona as I'm pretty sure
  * you obtain arsene before the ability to save
  */  
  if (personas.length === 0) {
    return (
      <div className="inventory-empty">
        <h2>No Personas Found</h2>
        <p>Upload a P5R save file to extract your persona inventory.</p>
      </div>
    );
  }

  return (
    <div className="persona-inventory">
      <div className="inventory-header">
        <h2>Persona Inventory ({personas.length} total)</h2>
        <button className="clear-button" onClick={onClear}>
          Clear Inventory
        </button>
      </div>

      <div className="inventory-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search personas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="level">Sort by Base Level</option>
          <option value="arcana">Sort by Arcana</option>
        </select>

        <select
          className="filter-select"
          value={filterArcana}
          onChange={(e) => setFilterArcana(e.target.value)}
        >
          <option value="all">All Arcanas</option>
          {arcanas.map(arcana => (
            <option key={arcana} value={arcana}>{arcana}</option>
          ))}
        </select>
      </div>

      <div className="inventory-stats">
        Showing {filteredPersonas.length} of {personas.length} collected personas
      </div>

      <div className="persona-grid">
        {filteredPersonas.map((persona, index) => {
          const personaData = getPersonaData(persona.name);
          const skills = personaData?.skills ? Object.entries(personaData.skills) : [];

          return (
            <div key={`${persona.uid}-${index}`} className="persona-card" onClick={ () => {
              setSelectedPersona(persona.name)
              setActiveTab("allPersonae")
            }}>
              <div className="persona-card-header">
                <h3 className="persona-name">{persona.name}</h3>
              </div>

              {personaData && (
                <div className="persona-details">
                  <div className="persona-arcana">{personaData.arcana}</div>
                  {skills.length > 0 && (
                    <div className="persona-skills">
                      {skills.map(([skillName, level], idx) => (
                        <span key={idx} className="skill-badge">
                          {skillName} <span className="skill-level">Lv{level}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          );


        })}
      </div>
    </div>
  );
  
}

export default PersonaInventory;
