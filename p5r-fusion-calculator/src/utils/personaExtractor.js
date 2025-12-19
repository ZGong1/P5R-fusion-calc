import personaDictionary from '../data/personaDictionary';
import { customPersonaeByArcana, personaMap } from '../fusion-calculator-core/DataUtil';
import FusionCalculator from '../fusion-calculator-core/FusionCalculator';

/**
 * Extracts personas from a decrypted P5R save file buffer
 *
 * Scans for the pattern: 0x01 0x00 [byte1] [byte2]
 * where [byte2][byte1] is the persona UID in little-endian format
 *
 * Filters by:
 * - Memory ranges: 0x4000-0x5FFF or 0x6000-0x9FFF
 * - Last nibble of address must be 0
 * - Skips blank entries (0x00 0x00)
 *
 * @param {Uint8Array} buffer - The decrypted save file buffer
 * @returns {Array} Array of persona objects with {address, uid, name}
 */
export function extractPersonas(buffer) {
  const results = [];

  // Optimized: Loop only over valid persona memory range (0x4000 to 0x9FFF)
  // Increment by 16 since personas are always at 16-byte aligned addresses
  for (let i = 0x4000; i < 0x9FFF; i += 16) {
    // Look for the pattern: 0x01 0x00 or 0x01 0x08 [byte1] [byte2] 
    if ( (buffer[i] === 0x01 && buffer[i + 1] === 0x00) || (buffer[i] === 0x01 && buffer[i + 1] === 0x08) ) {
      const byte1 = buffer[i + 2];
      const byte2 = buffer[i + 3];

      // Skip blank entries
      if (byte1 === 0x00 && byte2 === 0x00) {
        continue;
      }

      // Convert to little-endian hex format: 0x[byte2][byte1]
      const uid = `0x${byte2.toString(16).padStart(2, '0')}${byte1.toString(16).padStart(2, '0').toUpperCase()}`;
      const name = personaDictionary[uid] || "Unknown";

      // Skip if persona is unknown, reserved, or unused
      if (name === "Unknown" || name.includes("RESERVE") || name.includes("Unused")) {
        continue;
      }

      results.push({
        address: `0x${i.toString(16).padStart(8, '0')}`,
        uid: uid,
        name: name
      });
    }
  }

  return results;
}

/**
 * Gets unique personas from extraction results (removes duplicates)
 * @param {Array} personas - Array of persona objects from extractPersonas
 * @returns {Array} Array of unique personas
 */
export function getUniquePersonas(personas) {
  const uniqueMap = new Map();

  personas.forEach(persona => {
    if (!uniqueMap.has(persona.uid)) {
      uniqueMap.set(persona.uid, persona);
    }
  });

  return Array.from(uniqueMap.values());
}

/**
 * Saves persona inventory to localStorage
 * @param {Array} personas - Array of persona objects to save
 */
export function savePersonasToLocalStorage(personas) {
  try {
    const personaList = personas.map(p => ({
      uid: p.uid,
      name: p.name
    }));
    localStorage.setItem('p5r-persona-inventory', JSON.stringify(personaList));
    localStorage.setItem('p5r-last-updated', new Date().toISOString());
  } catch (error) {
    console.error('Error saving to localStorage:', error);
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
 * Clears persona inventory from localStorage
 */
export function clearPersonasFromLocalStorage() {
  try {
    localStorage.removeItem('p5r-persona-inventory');
    localStorage.removeItem('p5r-last-updated');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Gets the last update timestamp from localStorage
 * @returns {string|null} ISO timestamp or null
 */
export function getLastUpdateTime() {
  try {
    return localStorage.getItem('p5r-last-updated');
  } catch (error) {
    console.error('Error reading localStorage:', error);
    return null;
  }
}


/**
 * Returns Boolean if a persona is fusable (there is at least one branch below where both personas are owned)
 * @param {String} toFuse - String of the name of the persona you want to check
 * @param {Array} ownedPersonas - Array with strings of the personas the player has
 * @param {FusionCalculator} - An already setup fusion calculator object
 * @returns {Boolean} True/False if there is an immediate path to fuse with owned personas
 */
export function fusable(toFuse, ownedPersonas, calculator) {
  const toFuseWithData = personaMap[toFuse]
  console.log("toFuseWithData: ", toFuseWithData)
  const possibleFusions = calculator.getRecipes(toFuseWithData)

  console.log("possibleFusions: ", possibleFusions)

  for (let fusion of possibleFusions) {
    // TODO: actually printing now
    console.log("fusion.cost: ", fusion.cost)
  }

}


/**
 * Gets unique personas from extraction results (removes duplicates)
 * @param {Array} ownedPersonas - Array of persona objects that the player has in their compendium
 * @returns {Array} Array of personas that are directly fusable with current compendium
 */
export function saveFusableToLocalStorage(ownedPersonas) {

  const calculator = new FusionCalculator(customPersonaeByArcana)

  let toReturn = []
  // Create a Set of owned persona names for O(1) lookup
  const ownedSet = new Set(ownedPersonas.map(p => p.name))
  const allPersonas = Object.entries(personaMap).map( ([personaName, personaData]) => personaName)

  const unownedPersonas = allPersonas.filter(persona => !ownedSet.has(persona))

  console.log("unownedPersonas: ", unownedPersonas)
  
  fusable(unownedPersonas[1], ownedPersonas, calculator)

  return toReturn
}
