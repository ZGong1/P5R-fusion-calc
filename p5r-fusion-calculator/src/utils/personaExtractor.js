import personaDictionary from '../data/personaDictionary';

/**
 * Extracts personas from a decrypted P5R save file buffer
 *
 * Scans for the pattern: 0x01 0x00 [byte1] [byte2]
 * where [byte2][byte1] is the persona UID in little-endian format
 *
 * Filters by:
 * - Memory ranges: 0x4000-0x9FFF
 * - 16 byte aligned
 * - Skips blank entries (0x00 0x00)
 *
 * @param {Object} buffer - The decrypted save file buffer
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
 * Gets unique personas from extraction results (removes duplicates)
 * @param {Object} buffer - A buffer of the decrypted save file
 * @returns {Object} Metadata about the save file in object form such as player level, play time, difficulty, in game time, in game location
 */
export function extractSaveMetadata(buffer) {
  const newSlice = buffer.slice(0xd0, 0x130);

  const decoder = new TextDecoder('utf-8');

  const metaDataStr = decoder.decode(newSlice);

  const metaDataArr = metaDataStr.split('\n')

  const toReturn = {
    inGameDay: metaDataArr[0].split(",")[0],
    inGameLocation: metaDataArr[0].split(",")[1],
    playerLevel: metaDataArr[1].split(' ')[0].split(':')[1],
    inGameName: metaDataArr[1].split(' ')[1],
    playTime: metaDataArr[2].split(':')[1],
    difficulty: metaDataArr[3].split(':')[1]
  }

  console.log("toReturn: ", toReturn);
  return toReturn
}