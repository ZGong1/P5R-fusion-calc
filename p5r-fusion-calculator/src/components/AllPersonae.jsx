import { useState } from 'react';
import CompendiumSelector from './CompendiumSelector';
import FullPersonaCard from './FullPersonaCard';
import './AllPersonae.css';


function AllPersonae ({ selectedPersona, setSelectedPersona }) {

    
    return (
        <div className='all-personas'>
            <div className='persona-selector'>
                <h1>Compendium of all Personas</h1>
                Please select a Persona: <CompendiumSelector selectedPersona={selectedPersona} setSelectedPersona={setSelectedPersona} />
            </div>

            {console.log("selectedPersona: ", selectedPersona)}

            <FullPersonaCard selectedPersona={selectedPersona}/>

        </div>
    );


}

export default AllPersonae