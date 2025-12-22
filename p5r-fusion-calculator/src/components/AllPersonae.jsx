import { useSearchParams } from 'react-router-dom';
import CompendiumSelector from './CompendiumSelector';
import FullPersonaCard from './FullPersonaCard';
import './AllPersonae.css';


function AllPersonae () {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedPersona = searchParams.get('selected') || '';

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