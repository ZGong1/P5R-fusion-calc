import { useSearchParams } from 'react-router-dom'
import { useState, useEffect, useMemo } from "react"
import { usePersonas } from '../contexts/PersonaContext'
import { applyFusionFilters } from '../utils/fusionFilters'
import CompendiumSelector from './CompendiumSelector'
import FusionCalculator from '../fusion-calculator-core/FusionCalculator'
import { customPersonaList, customPersonaeByArcana } from '../fusion-calculator-core/DataUtil'
import SmallPersona from './SmallPersona'
import './Fusions.css'
import traits from "../data/traits.js"
import skills from "../data/skills.js"

const personaNames = customPersonaList.map((persona) => persona.name);

function Fusions() {
  const { personas, fusableImmediate } = usePersonas()
  // Get selected fusion from URL parameters
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedFusion = searchParams.get('selected') || ''

  // selected desired trait state
  const [desiredTrait, setDesiredTrait] = useState(
    () => localStorage.getItem('p5r-desired-trait') || null
  )

  // selected desired skill state
  const [desiredSkill, setDesiredSkill] = useState(
    () => localStorage.getItem('p5r-desired-skill') || null
  )

  // Initialize selected persona from localStorage on mount if URL is empty
  useEffect(() => {
    if (!selectedFusion) {
      const lastSelected = localStorage.getItem('p5r-last-selected-fusion')
      if (lastSelected) {
        setSearchParams({ selected: lastSelected }, { replace: true })
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Sync selected fusion to localStorage whenever it changes
  useEffect(() => {
    if (selectedFusion) {
      localStorage.setItem('p5r-last-selected-fusion', selectedFusion)
    }
  }, [selectedFusion])

  // Filter state variables - initialize from localStorage
  const [hideRare, setHideRare] = useState(
    () => localStorage.getItem('p5r-fusion-hideRare') === 'true'
  )
  const [hideDLC, setHideDLC] = useState(
    () => localStorage.getItem('p5r-fusion-hideDLC') === 'true'
  )
  const [hideNonOwned, setHideNonOwned] = useState(
    () => localStorage.getItem('p5r-fusion-hideNonOwned') === 'true'
  )
  const [showMixedOnly, setShowMixedOnly] = useState(
    () => localStorage.getItem('p5r-fusion-showMixedOnly') === 'true'
  )
  const [showDesiredTraitOnly, setShowDesiredTraitOnly] = useState(
    () => localStorage.getItem('p5r-fusion-showDesiredTraitOnly') === 'true'
  )
  const [showDesiredSkillOnly, setShowDesiredSkillOnly] = useState(
    () => localStorage.getItem('p5r-fusion-showDesiredSkillOnly') === 'true'
  )

  // Sync filters to localStorage
  useEffect(() => {
    localStorage.setItem('p5r-fusion-hideRare', hideRare.toString())
  }, [hideRare])

  useEffect(() => {
    localStorage.setItem('p5r-fusion-hideDLC', hideDLC.toString())
  }, [hideDLC])

  useEffect(() => {
    localStorage.setItem('p5r-fusion-hideNonOwned', hideNonOwned.toString())
  }, [hideNonOwned])

  useEffect(() => {
    localStorage.setItem('p5r-fusion-showMixedOnly', showMixedOnly.toString())
  }, [showMixedOnly])

  useEffect(() => {
    localStorage.setItem('p5r-fusion-showDesiredTraitOnly', showDesiredTraitOnly.toString())
  }, [showDesiredTraitOnly])

  useEffect(() => {
    localStorage.setItem('p5r-fusion-showDesiredSkillOnly', showDesiredSkillOnly.toString())
  }, [showDesiredSkillOnly])

  // Sync desired trait to localStorage
  useEffect(() => {
    if (desiredTrait) {
      localStorage.setItem('p5r-desired-trait', desiredTrait)
    } else {
      localStorage.removeItem('p5r-desired-trait')
    }
  }, [desiredTrait])

  // Sync desired skill to localStorage
  useEffect(() => {
    if (desiredSkill) {
      localStorage.setItem('p5r-desired-skill', desiredSkill)
    } else {
      localStorage.removeItem('p5r-desired-skill')
    }
  }, [desiredSkill])

  const handleSelectFusion = (name) => {
    if (name) {
      setSearchParams({ selected: name })
    } else {
      setSearchParams({})
    }
  }

  // initialize fusion calculator engine for fusion calculations
  const calculator = new FusionCalculator(customPersonaeByArcana)

  // only persona name is held in the URI so find object with all data
  const targetWithInfo = selectedFusion
    ? customPersonaList.find( persona => persona.name === selectedFusion )
    : null

  const isFound = personas?.find( persona => persona.name === selectedFusion )

  // Obtain list of recipes, and filter down if options are set
  const rawRecipes = selectedFusion
    ? calculator.getRecipes(targetWithInfo)
    : null

  // Apply filters using util function with memoization
  const gottenRecipes = useMemo(() => {
    return applyFusionFilters(
      rawRecipes,
      { hideRare, hideDLC, hideNonOwned, showMixedOnly, showDesiredTraitOnly, showDesiredSkillOnly },
      personas,
      fusableImmediate,
      desiredTrait,
      desiredSkill
    )
  }, [rawRecipes, hideRare, hideDLC, hideNonOwned, showMixedOnly, showDesiredTraitOnly, showDesiredSkillOnly, personas, fusableImmediate, desiredTrait, desiredSkill])

  return (
    <div className='fusion-calculator'>
      {/* Persona selector and related combobox selectors */}
      <div className='fusion-header'>
        Please select which Persona you would like to fuse: {" "}
        <CompendiumSelector items={personaNames} selectedItem={selectedFusion} setSelectedItem={handleSelectFusion} ariaLabel="Select persona to fuse"/> <br/>
        Please select which trait you would like to target: {" "}
        <CompendiumSelector items={traits} selectedItem={desiredTrait} setSelectedItem={e => setDesiredTrait(e)} ariaLabel="Select trait to target"/> <br/>
        Please select which skill you would like to target: {" "}
        <CompendiumSelector items={skills} selectedItem={desiredSkill} setSelectedItem={e => setDesiredSkill(e)} ariaLabel="Select skill to target"/>
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
        <label className='toggle-label'>
          <input
            type='checkbox'
            checked={showDesiredTraitOnly}
            onChange={(e) => setShowDesiredTraitOnly(e.target.checked)}
            className='toggle-checkbox'
          />
          <span className='toggle-slider'></span>
          <span className='toggle-text'>Show Only Recipes With Desired Trait</span>
        </label>
        <label className='toggle-label'>
          <input
            type='checkbox'
            checked={showDesiredSkillOnly}
            onChange={(e) => setShowDesiredSkillOnly(e.target.checked)}
            className='toggle-checkbox'
          />
          <span className='toggle-slider'></span>
          <span className='toggle-text'>Show Only Recipes With Desired Skill</span>
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
          Blue border means it has the targeted trait or skill <br/>
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
                    persona={persona}
                    personas={personas}
                    fusableImmediate={fusableImmediate}
                    desiredTrait={desiredTrait}
                    desiredSkill={desiredSkill}
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