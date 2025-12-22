import { useSearchParams } from 'react-router-dom'
import CompendiumSelector from './CompendiumSelector'
import FusionCalculator from '../fusion-calculator-core/FusionCalculator'
import { customPersonaList, customPersonaeByArcana } from '../fusion-calculator-core/DataUtil';
import SmallPersona from './SmallPersona';
import {useState} from "react";
import './Fusions.css'


function Fusions({ personas, fusableImmediate }) {
  // Get selected fusion from URL parameters
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedFusion = searchParams.get('selected') || ''

  // Filter state variables
  const [hideRare, setHideRare] = useState(false)
  const [hideDLC, setHideDLC] = useState(false)
  const [hideNonOwned, setHideNonOwned] = useState(false)
  const [showMixedOnly, setShowMixedOnly] = useState(false)

  const handleSelectFusion = (name) => {
    if (name) {
      setSearchParams({ selected: name })
    } else {
      setSearchParams({})
    }
  }

  // initialize fusion calculator engine for fusion calculations
  const calculator = new FusionCalculator(customPersonaeByArcana)

  // only persona name is passed; get full object with all persona data
  // TODO: pass this into SmallPersona because it is useful there as well
  const targetWithInfo = selectedFusion 
    ? customPersonaList.find( persona => persona.name === selectedFusion ) 
    : null

  // TODO: pass into SmallPersona because it is useful here as well
  const isFound = personas?.find( persona => persona.name === selectedFusion )

  let gottenRecipes = selectedFusion
    ? calculator.getRecipes(targetWithInfo)
    : null

  // filter rares
  if (gottenRecipes && hideRare) {
    gottenRecipes = gottenRecipes.filter(recipe => {
      return !recipe.sources.some(source => source.rare)
    })
  }
  
  // filter DLC
  if (gottenRecipes && hideDLC) {
    gottenRecipes = gottenRecipes.filter(recipe => {
      return !recipe.sources.some(source => source.dlc)
    })
  }

  // filter recipes with non-owned personas
  if (gottenRecipes && hideNonOwned) {
    gottenRecipes = gottenRecipes.filter(recipe => {
      return recipe.sources.every(source =>
        personas?.find(persona => persona.name === source.name)
      )
    })
  }

  // filter to show only recipes where all components are owned or fusable
  if (gottenRecipes && showMixedOnly) {
    gottenRecipes = gottenRecipes.filter(recipe => {
      return recipe.sources.every(source => {
        const isOwned = personas?.find(persona => persona.name === source.name)
        const isFusable = fusableImmediate?.find(persona => persona === source.name)
        return isOwned || isFusable
      })
    })
  }

  return (
    <div className='fusion-calculator'>
      {/* Persona selector */}
      <div className='fusion-header'>
        <p>Please select which Persona you would like to fuse:</p>
        <CompendiumSelector selectedPersona={selectedFusion} setSelectedPersona={handleSelectFusion}/>
      </div>

      {/* Filter toggles */}
      <div className='filter-toggles'>
        <label className='toggle-label'>
          <input
            type='checkbox'
            checked={hideRare}
            onChange={(e) => setHideRare(e.target.checked)}
            className='toggle-checkbox'
          />
          <span className='toggle-slider'></span>
          <span className='toggle-text'>Hide Rare Personas</span>
        </label>
        <label className='toggle-label'>
          <input
            type='checkbox'
            checked={hideDLC}
            onChange={(e) => setHideDLC(e.target.checked)}
            className='toggle-checkbox'
          />
          <span className='toggle-slider'></span>
          <span className='toggle-text'>Hide DLC Personas</span>
        </label>
        <label className='toggle-label'>
          <input
            type='checkbox'
            checked={hideNonOwned}
            onChange={(e) => setHideNonOwned(e.target.checked)}
            className='toggle-checkbox'
          />
          <span className='toggle-slider'></span>
          <span className='toggle-text'>Show Only Owned Personas</span>
        </label>
        <label className='toggle-label'>
          <input
            type='checkbox'
            checked={showMixedOnly}
            onChange={(e) => setShowMixedOnly(e.target.checked)}
            className='toggle-checkbox'
          />
          <span className='toggle-slider'></span>
          <span className='toggle-text'>Show Mixed Owned/Fusable</span>
        </label>
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

      {selectedFusion && gottenRecipes && gottenRecipes.length === 0 && (
        <div className='info-message'>
          No recipes match your current filters. Try adjusting the toggle settings above.
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
                    onClick={() => handleSelectFusion(persona.name)}
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