import { customPersonaList } from '../fusion-calculator-core/DataUtil';

import './FullPersonaCard.css'

function FullPersonaCard( {selectedPersona} ) {

  if (!selectedPersona) return "Please select a Persona"

  const personaWithInfo = customPersonaList.find( persona => persona.name === selectedPersona)

  return (
    <div className="persona-card-container">
      {/* Header with Name */}
      <div className="persona-header">
        <h1>{personaWithInfo?.name}</h1>
      </div>

      {/* Main content - two columns on desktop, stacked on mobile */}
      <div className="persona-content">
        {/* Left Column */}
        <div className="persona-left-column">
          {/* Details Section */}
          <div className="persona-section">
            <h3>Details</h3>
            <div className="detail-row">
              <strong>Arcana:</strong> <span>{personaWithInfo?.arcana}</span>
            </div>
            <div className="detail-row">
              <strong>Base Level:</strong> <span>{personaWithInfo?.level}</span>
            </div>
            <div className="detail-row">
              <strong>Inherits:</strong> <span>{personaWithInfo?.inherits}</span>
            </div>
            <div className="detail-row">
              <strong>Trait:</strong> <span>{personaWithInfo?.trait}</span>
            </div>
            <div className="detail-row">
              <strong>Itemization:</strong> <span>{personaWithInfo?.item}/{personaWithInfo?.itemr}</span>
            </div>
          </div>

          {/* Skills Section */}
          <div className="persona-section skills-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {
                Object.entries(personaWithInfo?.skills).map(([skill, levelObtained]) => (
                  <div key={skill} className="skill-item">
                    {skill} <span className="skill-level">Lv. {levelObtained}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="persona-right-column">
          {/* Stats Section */}
          <div className="persona-section">
            <h3>Stats</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Strength</th>
                    <th>Magic</th>
                    <th>Endurance</th>
                    <th>Agility</th>
                    <th>Luck</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {
                      personaWithInfo?.stats.map((value, index) => (
                        <td key={index}>{value}</td>
                      ))
                    }
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Affinities Section */}
          <div className="persona-section">
            <h3>Affinities</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Phys</th>
                    <th>Gun</th>
                    <th>Fire</th>
                    <th>Ice</th>
                    <th>Elec</th>
                    <th>Wind</th>
                    <th>Psy</th>
                    <th>Nuke</th>
                    <th>Bless</th>
                    <th>Curse</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {
                      personaWithInfo?.elems.map((value, index) => (
                        <td key={index}>{value}</td>
                      ))
                    }
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullPersonaCard
