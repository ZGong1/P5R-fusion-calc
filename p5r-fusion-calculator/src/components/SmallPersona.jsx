import './SmallPersona.css'
import {personaMap} from "../fusion-calculator-core/FusionCalculator.js";
import { useNavigate } from 'react-router-dom';

function SmallPersona( { name, personas, fusableImmediate, onClick } ) {
    const navigate = useNavigate();

    const personaWithInfo = personaMap[name]

    // console.log("personas: ", personas)
    const isFound = personas?.find( persona => persona.name === name )
    const isFusable = fusableImmediate?.find( persona => persona === name)
    const isRare = personaWithInfo.rare
    const isDLC = personaWithInfo.dlc

    // compute class name for colorful results
    let className = "small-persona"
    if (isFound) {
        className += " green"
    }
    if (isFusable) {
        className += " fusable"
    }

    // Compute title for tooltips involving DLC/rare personas
    let title = ""
    if (isRare) {
        title = "This is a treasure demon and may have inconsistent fusion results"
    }
    if (isDLC) {
        title = "This is a DLC Persona"
    }

    // Handle info icon click - navigate to All Personas page
    const handleInfoClick = (e) => {
        e.stopPropagation(); // Prevent triggering the main onClick
        navigate(`/all-personas?selected=${encodeURIComponent(name)}`);
    };

    return (
        <div className={className} key={name} onClick={onClick} title={title}>
            { (isRare || isDLC) && "⚠️"}
            {name}
            <span
                className="persona-info-icon"
                onClick={handleInfoClick}
                title="View detailed info"
            >
                ℹ️
            </span>
        </div>
    )

}

export default SmallPersona