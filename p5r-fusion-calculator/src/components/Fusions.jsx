import CompendiumSelector from './CompendiumSelector'
import FusionCalculator from '../fusion-calculator-core/FusionCalculator'
import { customPersonaList, customPersonaeByArcana } from '../fusion-calculator-core/DataUtil';
import './Fusions.css'
import SmallPersona from './SmallPersona';


function Fusions({ selectedFusion, setSelectedFusion, personas }) {

  const calculator = new FusionCalculator(customPersonaeByArcana)

  const targetWithInfo = selectedFusion 
    ? customPersonaList.find( persona => persona.name === selectedFusion ) 
    : null

  const gottenRecipes = selectedFusion
    ? calculator.getRecipes(targetWithInfo)
    : null


  return (
    <div className='fusion-calculator'>
      Please select which Persona you would like to fuse:
      <CompendiumSelector selectedPersona={selectedFusion} setSelectedPersona={setSelectedFusion}/> <br/>

      {/* {console.log("gottenRecipes: ", gottenRecipes)} */}
      {/* {gottenRecipes ? gottenRecipes?.length + " recipes were found" : ""} */}
      

      {/* Loop through 1 level fusions for selectedFusion */}
      {gottenRecipes?.map( (recipe, index) => (<div key={index} className='recipe-wrapper'>

        {/* Map instead of just show 2 to handle special fusions that involve more than 2 soners */}
        {recipe.sources.map( persona => (
          <SmallPersona name={persona.name} personas={personas}/>
        ))}

      </div>))}


    </div>
  )

}

export default Fusions