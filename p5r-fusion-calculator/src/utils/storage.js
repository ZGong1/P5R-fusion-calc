import { personaMap } from '../fusion-calculator-core/DataUtil';
import FusionCalculator from '../fusion-calculator-core/FusionCalculator';
import { customPersonaeByArcana } from '../fusion-calculator-core/DataUtil';
import { fusable } from './fusionUtils';

/**
 * Saves persona inventory to localStorage
 * @param {Array} personas - Array of persona objects to save
 */ // TODO: Make this only save an array of strings. UID's aren't useful beyond the initial data extraction
export function savePersonasToLocalStorage(personas) {
  try {
    const personaList = personas.map(p => ({
      uid: p.uid,
      name: p.name
    }));
    localStorage.setItem('p5r-persona-inventory', JSON.stringify(personaList));
    localStorage.setItem('p5r-last-updated', new Date().toISOString());
  } catch (error) {
    console.error('Error saving owned persona list to localStorage:', error);
  }
}

/**
 * Loads persona inventory from localStorage
 * @returns {Array|null} Array of persona objects or null if not found
 */
export function loadPersonasFromLocalStorage() {
  try {
    const stored = localStorage.getItem('p5r-persona-inventory');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
}

/**
 * Gets personas that are directly fusable with current compendium
 * @param {Array} ownedPersonas - Array of persona objects that the player has in their compendium
 * @returns {Array} Array of personas that are directly fusable with current compendium
 */
export function saveFusableToLocalStorage(ownedPersonas) {

  const calculator = new FusionCalculator(customPersonaeByArcana)

  let fusablePersonas = []
  // TODO: use this
  let notFusablePersonas = []

  // Create a Set of owned persona names for O(1) lookup
  const ownedSet = new Set(ownedPersonas.map(p => p.name))
  const allPersonas = Object.entries(personaMap).map( ([personaName]) => personaName)

  const unownedPersonas = allPersonas.filter(persona => !ownedSet.has(persona))


  // Loop through all unowned personas and check if they're fusable
  unownedPersonas.forEach(personaName => {
    const isFusable = fusable(personaName, ownedPersonas, calculator)

    if (isFusable) {
      fusablePersonas.push(personaName)
      // console.log(`${personaName} - CAN fuse with current inventory`)
    } else {
      notFusablePersonas.push(personaName)
      // console.log(`${personaName} - Cannot fuse yet`)
    }
  })

  // Save fusable personas to localStorage
  try {
    localStorage.setItem('p5r-fusable-personas', JSON.stringify(fusablePersonas))
    console.log(`💾 Saved ${fusablePersonas.length} fusable personas to localStorage`)
  } catch (error) {
    console.error('Error saving fusable personas to localStorage:', error)
  }

  return fusablePersonas
}

/**
 * Loads persona inventory from localStorage
 * @returns {Array|null} Array of persona strings or null if not found
 */
export function loadFusableImmediateFromLocalStorage() {
  try {
    const stored = localStorage.getItem('p5r-fusable-personas');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
}

export function saveMetaDataToLocalStorage(metadata) {
  try {
    localStorage.setItem('p5r-save-metadata', JSON.stringify(metadata));
  } catch (error) {
    console.error('Error saving metadata to localstorage:', error)
  }
}

export function loadMetaDataFromLocalStorage() {
  try {
    const stored = localStorage.getItem('p5r-save-metadata')
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading metadata to localstorage:', error);
  }
}

/**
 * Clears persona inventory from localStorage
 */
export function clearLocalStorage() {
  try {
    localStorage.removeItem('p5r-persona-inventory');
    localStorage.removeItem('p5r-last-updated');
    localStorage.removeItem('p5r-fusable-personas')
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}