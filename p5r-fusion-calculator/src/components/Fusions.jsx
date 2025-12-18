import CompendiumSelector from './CompendiumSelector'
import FusionCalculator from '../fusion-calculator-core/FusionCalculator'
import { customPersonaList, customPersonaeByArcana } from '../fusion-calculator-core/DataUtil';
import './Fusions.css'
import SmallPersona from './SmallPersona';


function Fusions({ selectedFusion, setSelectedFusion }) {

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
      {gottenRecipes ? gottenRecipes?.length + " recipes were found" : ""}
      {gottenRecipes?.map( (recipe, index) => (<div key={index} className='recipe-wrapper'>

        <SmallPersona name={recipe.sources[0].name}/>
        <SmallPersona name={recipe.sources[1].name}/>
        {/* {recipe.sources[0].name} + {recipe.sources[1].name} */}

      </div>))}


    </div>
  )

}

export default Fusions