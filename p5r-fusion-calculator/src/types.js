/**
 * Type definitions for P5R Fusion Calculator
 * These JSDoc typedefs provide autocomplete and type checking for JavaScript
 */

/**
 * Main persona data structure from PersonaDataRoyal.js
 * @typedef {Object} PersonaData
 * @property {string} name - Persona name (e.g., "Arsene", "Pixie")
 * @property {number} level - Base level of the persona
 * @property {string} arcana - Arcana type (e.g., "Fool", "Magician", "Lovers")
 * @property {string} inherits - Element type this persona inherits (e.g., "Curse", "Fire", "Ice")
 * @property {string[]} elems - Element resistances array [Phys, Gun, Fire, Ice, Elec, Wind, Psy, Nuke, Bless, Curse]
 *                              Values: "wk" (weak), "rs" (resist), "nu" (null), "rp" (repel), "ab" (absorb), "-" (normal)
 * @property {Object.<string, number>} skills - Skill name to level learned mapping
 * @property {number[]} stats - Base stats array [Strength, Magic, Endurance, Agility, Luck]
 * @property {string} trait - Persona trait name
 * @property {string} [item] - Item obtained from itemization
 * @property {string} [itemr] - Rare item obtained from itemization (alarm)
 * @property {boolean} [skillCard] - Whether this persona can produce skill cards
 * @property {boolean} [special] - Whether this is a special fusion persona (requires 3+ sources)
 * @property {boolean} [rare] - Whether this is a treasure demon (rare persona)
 * @property {boolean} [max] - Whether confidant must be maxed to fuse
 * @property {string} [area] - Palace/Mementos area where found
 * @property {string} [floor] - Specific floor where found
 * @property {string} [note] - Special notes about availability
 */

/**
 * Extracted persona from save file
 * @typedef {Object} ExtractedPersona
 * @property {string} address - Hex memory address where found (e.g., "0x00004000")
 * @property {string} uid - Persona unique ID in hex format (e.g., "0x0001")
 * @property {string} name - Persona name from dictionary lookup
 */

/**
 * Fusion recipe - describes how to create a persona
 * @typedef {Object} Recipe
 * @property {PersonaData[]} sources - Array of source personas (2 for normal, 3+ for special)
 * @property {PersonaData} result - Resulting persona from fusion
 * @property {number} cost - Estimated fusion cost in yen
 * @property {boolean} isAllRare - Whether all source personas are rare (treasure demons)
 */

/**
 * Special fusion combo (3+ personas)
 * @typedef {Object} SpecialCombo
 * @property {string[]} sources - Array of source persona names
 * @property {string} result - Name of resulting persona
 */

/**
 * 2-Arcana fusion combo
 * @typedef {Object} Arcana2Combo
 * @property {string[]} source - Array of 2 arcana names
 * @property {string} result - Resulting arcana name
 */

/**
 * Dictionary mapping persona UIDs to names
 * @typedef {Object.<string, string>} PersonaDictionary
 * @example
 * {
 *   "0x0001": "Metatron",
 *   "0x0006": "Pixie"
 * }
 */

/**
 * Map of persona names to their full data
 * @typedef {Object.<string, PersonaData>} PersonaMap
 * @example
 * {
 *   "Arsene": { level: 1, arcana: "Fool", ... },
 *   "Pixie": { level: 2, arcana: "Lovers", ... }
 * }
 */

/**
 * Personas organized by arcana
 * @typedef {Object.<string, PersonaData[]>} PersonaeByArcana
 * @example
 * {
 *   "Fool": [{ name: "Arsene", level: 1, ... }],
 *   "Magician": [{ name: "Jack-o'-Lantern", level: 2, ... }]
 * }
 */

/**
 * Rare combo modifier data
 * @typedef {Object.<string, number[]>} RareCombos
 * Maps arcana name to array of modifiers for each rare persona
 */

// Export a dummy object to make this a module
export const Types = {};