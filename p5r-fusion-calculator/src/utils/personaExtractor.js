import personaDictionary from '../data/personaDictionary';

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

  for (let i = 0; i < buffer.length - 3; i++) {
    // Look for the pattern: 0x01 0x00 [byte1] [byte2]
    if (buffer[i] === 0x01 && buffer[i + 1] === 0x00) {
      const byte1 = buffer[i + 2];
      const byte2 = buffer[i + 3];

      // Check if last nibble of address is 0
      const lastNibble = i & 0b1111;

      // Skip blank entries
      if (byte1 === 0x00 && byte2 === 0x00) {
        continue;
      }

      // Skip if last nibble is not 0
      if (lastNibble !== 0) {
        continue;
      }

      // Check if address is in valid persona memory ranges
      if ((i > 0x4000 && i < 0x5FFF) || (i > 0x6000 && i < 0x9FFF)) {
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
