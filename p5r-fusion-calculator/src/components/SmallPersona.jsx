import './SmallPersona.css'

function SmallPersona( { name, personas, fusableImmediate } ) {

    // console.log("personas: ", personas)
    const isFound = personas?.find( persona => persona.name === name )
    const isFusable = fusableImmediate?.find( persona => persona === name)

    let className = "small-persona"
    if (isFound) {
        className += " green"
    }
    if (isFusable) {
        className += " fusable"
    }

    return (
        <div className={className} key={name}>
            {name}
        </div>
    )

}

export default SmallPersona