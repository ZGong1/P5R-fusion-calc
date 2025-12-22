import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import CompendiumSelector from './CompendiumSelector';
import FullPersonaCard from './FullPersonaCard';
import './AllPersonae.css';


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
        }
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
                Please select a Persona: <CompendiumSelector selectedPersona={selectedPersona} setSelectedPersona={handleSelectPersona} />
            </div>

            {/* {console.log("selectedPersona: ", selectedPersona)} */}

            <FullPersonaCard selectedPersona={selectedPersona}/>

        </div>
    );


}

export default AllPersonae