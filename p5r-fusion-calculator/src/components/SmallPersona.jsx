import './SmallPersona.css'
import {personaMap} from "../fusion-calculator-core/FusionCalculator.js";

function SmallPersona( { name, personas, fusableImmediate, onClick } ) {

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

    return (
        <div className={className} key={name} onClick={onClick} title={title}>
            { (isRare || isDLC) && "⚠️"}
            {name}
        </div>
    )

}

export default SmallPersona