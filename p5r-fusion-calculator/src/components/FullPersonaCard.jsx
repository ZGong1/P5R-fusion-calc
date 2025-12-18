import { customPersonaList } from '../fusion-calculator-core/DataUtil';

import './FullPersonaCard.css'

function FullPersonaCard( {selectedPersona} ) {

    if (!selectedPersona) return "Please select a Persona"

    const personaWithInfo = customPersonaList.find( persona => persona.name === selectedPersona)

    return (
        <div className="stats-card">
            {/* Name */}
            <div className="sc1"> <h1>{personaWithInfo?.name} </h1></div>
            {/* Details */}
            <div className="sc2">
                <strong>Arcana:</strong> {personaWithInfo?.arcana} <br/>
                <strong>Itemization:</strong> {personaWithInfo?.item}/{personaWithInfo?.itemr} <br/>
                <strong>Trait:</strong> {personaWithInfo?.trait} <br/>
                <strong>Inherits:</strong> {personaWithInfo?.inherits} <br/>
                <strong>Base Level:</strong> {personaWithInfo?.level} <br/>
            </div>
            {/* Skills */}
            <div className="sc3">
                <strong>Skills:</strong>
                {
                    Object.entries(personaWithInfo?.skills).map(([skill, levelObtained]) => (
                        <div key={skill}>
                            {skill} (Lv. {levelObtained})
                        </div>
                    ))
                }
            </div>
            {/* Affinities */}
            <div className="sc4"> 
                <strong>Affinities:</strong>
                 <table>
                    <tr>
                        <th>Physical</th>
                        <th>Gun</th>
                        <th>Fire</th>
                        <th>Ice</th>
                        <th>Electric</th>
                        <th>Wind</th>
                        <th>Psychic</th>
                        <th>Nuclear</th>
                        <th>Bless</th>
                        <th>Curse</th>
                    </tr>
                    <tr>
                        {
                            personaWithInfo?.elems.map((value, index) => (
                                <td key={index}>{value}</td>
                            ))
                        }
                    </tr>
                 </table>
            </div>
            {/* Stats */}
            <div className="sc5">
                <strong>Stats:</strong> 
                <table>
                    <tr>
                        <th>Strength</th>
                        <th>Magic</th>
                        <th>Endurance</th>
                        <th>Agility</th>
                        <th>Luck</th>
                    </tr>
                    <tr>
                        {
                            personaWithInfo?.stats.map((value, index) => (
                                <td key={index}>{value}</td>
                            ))
                        }
                    </tr>
                </table>
            </div>
            {/* Location */}
            <div className="sc6"> Location: </div>
        </div>
    );
}

export default FullPersonaCard