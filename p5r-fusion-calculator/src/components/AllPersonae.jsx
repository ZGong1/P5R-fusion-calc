import { useState } from 'react';
import CompendiumSelector from './CompendiumSelector';
import './AllPersonae.css';


function AllPersonae ({ props }) {

    const [selectedPersona, setSelectedPersona] = useState("")
    
    return (
        <div className='all-personas'>
            <div className='persona-selector'>
                <h1>Compendium of all Personas</h1>
                Please select a Persona: <CompendiumSelector selectedPersona={selectedPersona} setSelectedPersona={setSelectedPersona} />
            </div>


        </div>
    );


}

export default AllPersonae