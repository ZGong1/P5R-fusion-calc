import CompendiumSelector from './CompendiumSelector'
import FusionCalculator from '../fusion-calculator-core/FusionCalculator'
import { customPersonaList, customPersonaeByArcana } from '../fusion-calculator-core/DataUtil';
import './Fusions.css'
import SmallPersona from './SmallPersona';


function Fusions({ selectedFusion, setSelectedFusion, personas, fusableImmediate }) {

  // initialize fusion calculator engine for fusion calculations
  const calculator = new FusionCalculator(customPersonaeByArcana)

  // only persona name is passed; get full object with all persona data
  const targetWithInfo = selectedFusion 
    ? customPersonaList.find( persona => persona.name === selectedFusion ) 
    : null

  // TODO: pass into SmallPersona because it is useful here as well
  const isFound = personas?.find( persona => persona.name === selectedFusion )

  const gottenRecipes = selectedFusion
    ? calculator.getRecipes(targetWithInfo)
    : null


  return (
    <div className='fusion-calculator'>
      Please select which Persona you would like to fuse:
      <CompendiumSelector selectedPersona={selectedFusion} setSelectedPersona={setSelectedFusion}/> <br/>

      {/* {console.log("gottenRecipes: ", gottenRecipes)} */}
      {/* {gottenRecipes ? gottenRecipes?.length + " recipes were found" : ""} */}

      {isFound && `You already own ${selectedFusion}`}

      {/* Loop through list of recipes for `selectedFusion` */}
      {gottenRecipes?.map( (recipe, index) => (<div key={index} className='recipe-wrapper'>

        {/* Map instead of just show 2 to handle special fusions that involve more than 2 soners */}
        {recipe.sources.map( persona => (
          <SmallPersona
            key={persona.name}
            name={persona.name}
            personas={personas}
            fusableImmediate={fusableImmediate}
            onClick={() => setSelectedFusion(persona.name)}/>
        ))}

      </div>))}


    </div>
  )

}

export default Fusions