import './FullPersonaCard.css'

function FullPersonaCard( {selectedPersona} ) {

    if (!selectedPersona?.name) return "Please select a Persona"

    return (
        <div class="stats-card">
            {/* Name */}
            <div class="sc1"> <h1>{selectedPersona?.name} </h1></div>
            {/* Details */}
            <div class="sc2">
                <strong>Arcana:</strong> {selectedPersona?.arcana} <br/>
                <strong>Itemization:</strong> {selectedPersona?.item}/{selectedPersona?.itemr} <br/>
                <strong>Trait:</strong> {selectedPersona?.trait} <br/>
                <strong>Inherits:</strong> {selectedPersona?.inherits} <br/>
                <strong>Base Level:</strong> {selectedPersona?.level} <br/>
            </div>
            {/* Skills */}
            <div class="sc3">
                <strong>Skills:</strong>
                {
                    Object.entries(selectedPersona?.skills).map(([skill, levelObtained]) => (
                        <div key={skill}>
                            {skill} (Lv. {levelObtained})
                        </div>
                    ))
                }
            </div>
            {/* Affinities */}
            <div class="sc4"> 
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
                            selectedPersona?.elems.map((value, index) => (
                                <td key={index}>{value}</td>
                            ))
                        }
                    </tr>
                 </table>
            </div>
            {/* Stats */}
            <div class="sc5">
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
                            selectedPersona?.stats.map((value, index) => (
                                <td key={index}>{value}</td>
                            ))
                        }
                    </tr>
                </table>
            </div>
            {/* Location */}
            <div class="sc6"> Location: </div>
        </div>
    );
}

export default FullPersonaCard