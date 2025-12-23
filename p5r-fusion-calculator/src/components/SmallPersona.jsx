import './SmallPersona.css'
import { useNavigate } from 'react-router-dom';

function SmallPersona( { persona, personas, fusableImmediate, desiredTrait, onClick } ) {
    const navigate = useNavigate();

    // Persona object now passed directly, no lookup needed
    const name = persona.name

    // console.log("personas: ", personas)
    const isFound = personas?.find( p => p.name === name )
    const isFusable = fusableImmediate?.find( p => p === name)
    const isRare = persona.rare
    const isDLC = persona.dlc
    const hasDesiredTrait = desiredTrait === persona.trait;

    // compute class name for colorful results
    let className = "small-persona"
    if (isFound) {
        className += " green"
    }
    if (isFusable) {
        className += " fusable"
    }
    if (hasDesiredTrait) {
        className += " desired-trait"
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