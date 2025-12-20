import CompendiumSelector from './CompendiumSelector'
import FusionCalculator from '../fusion-calculator-core/FusionCalculator'
import { customPersonaList, customPersonaeByArcana } from '../fusion-calculator-core/DataUtil';
import './Fusions.css'
import SmallPersona from './SmallPersona';


function Fusions({ selectedFusion, setSelectedFusion, personas, fusableImmediate }) {

  // initialize fusion calculator engine for fusion calculations
  const calculator = new FusionCalculator(customPersonaeByArcana)

  // only persona name is passed; get full object with all persona data
  // TODO: pass this into SmallPersona because it is useful there as well
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
      <div className='fusion-header'>
        <p>Please select which Persona you would like to fuse:</p>
        <CompendiumSelector selectedPersona={selectedFusion} setSelectedPersona={setSelectedFusion}/>
      </div>

      {/* Recipe count */}
      {gottenRecipes && gottenRecipes.length > 0 && (
        <div className='recipe-count'>
          {gottenRecipes.length} recipe{gottenRecipes.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Warning/info messages */}
      {personas.length === 0 && (
        <div className='info-message'>
          You must upload a save file to fully utilize this app!
        </div>
      )}

      {isFound && (
        <div className='success-message'>
          You already own {selectedFusion}
        </div>
      )}

      {targetWithInfo?.rare && (
        <div className='warning-message'>
          Treasure demons can't be fused!
        </div>
      )}

      {/* Legend section */}
      {selectedFusion && (
        <>
          <h3>Legend:</h3>
          <p>Green means it's a persona you already own <br/>
          Yellow means it's a persona you can directly fuse <br/>
          ⚠️ means it's either a treasure demon or DLC <small>(hover for details)</small></p>
        </>
      )}

      {/* Recipe list */}
      {gottenRecipes && gottenRecipes.length > 0 && (
        <div className='recipes-list'>
          {gottenRecipes.map((recipe, index) => (
            <div key={index} className='recipe-wrapper'>
              {recipe.sources.map((persona, personaIndex) => (
                <span key={persona.name} style={{ display: 'contents' }}>
                  <SmallPersona
                    name={persona.name}
                    personas={personas}
                    fusableImmediate={fusableImmediate}
                    onClick={() => setSelectedFusion(persona.name)}
                  />
                  {personaIndex < recipe.sources.length - 1 && (
                    <span className='fusion-separator'>+</span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )

}

export default Fusions