import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import CompendiumSelector from './CompendiumSelector';
import FullPersonaCard from './FullPersonaCard';
import { customPersonaList } from '../fusion-calculator-core/DataUtil';
import './AllPersonae.css';

const personaNames = customPersonaList.map((persona) => persona.name);


function AllPersonae () {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedPersona = searchParams.get('selected') || '';

    // Initialize selected persona from localStorage on mount if URL is empty
    useEffect(() => {
        if (!selectedPersona) {
            const lastSelected = localStorage.getItem('p5r-last-selected-persona');
            if (lastSelected) {
                setSearchParams({ selected: lastSelected }, { replace: true });
            }
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    // Sync selected persona to localStorage whenever it changes
    useEffect(() => {
        if (selectedPersona) {
            localStorage.setItem('p5r-last-selected-persona', selectedPersona);
        }
    }, [selectedPersona]);

    const handleSelectPersona = (name) => {
        if (name) {
            setSearchParams({ selected: name });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className='all-personas'>
            <div className='persona-selector'>
                <h1>Compendium of all Personas</h1>
                Please select a Persona: <CompendiumSelector items={personaNames} selectedItem={selectedPersona} setSelectedItem={handleSelectPersona} ariaLabel="Select persona" />
            </div>

            {/* {console.log("selectedPersona: ", selectedPersona)} */}

            <FullPersonaCard selectedPersona={selectedPersona}/>

        </div>
    );


}

export default AllPersonae