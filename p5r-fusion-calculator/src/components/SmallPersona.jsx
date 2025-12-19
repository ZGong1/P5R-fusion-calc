import './SmallPersona.css'

function SmallPersona( { name, personas } ) {

    // console.log("personas: ", personas)
    const isFound = personas?.find( persona => persona.name === name )

    let className = "small-persona"
    if (isFound) {
        className += " green"
    }

    return (
        <div className={className}>
            {name}
        </div>
    )

}

export default SmallPersona