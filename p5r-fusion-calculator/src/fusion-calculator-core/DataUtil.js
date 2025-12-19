import { personaMap } from './data/PersonaDataRoyal.js';
import { arcana2Combos, specialCombos } from './data/Data5Royal.js';

/**
 * @typedef {import('../types').PersonaData} PersonaData
 * @typedef {import('../types').PersonaMap} PersonaMap
 * @typedef {import('../types').PersonaeByArcana} PersonaeByArcana
 */

/**
 * Minimal DataUtil for fusion calculations
 * Contains only the essential utilities needed for the FusionCalculator
 */

/**
 * List of all personas (customize based on your needs, e.g., filter DLC)
 * For standalone usage, you may want to modify this to include/exclude certain personas
 * @type {PersonaData[]}
 */
const customPersonaList = (() => {
    let arr = [];
    for (let key in personaMap) {
        if (personaMap.hasOwnProperty(key)) {
            let persona = personaMap[key];
            persona.name = key;
            // This is where filtering would be done if in the future DLC could be excluded
            arr.push(persona);
        }
    }
    return arr;
})();

/**
 * Persona organized by arcana for efficient fusion calculations
 * @type {PersonaeByArcana}
 */
const customPersonaeByArcana = (() => {
    let personaeByArcana_ = {};
    for (let i = 0; i < customPersonaList.length; i++) {
        let persona = customPersonaList[i];
        if (!personaeByArcana_[persona.arcana]) {
            personaeByArcana_[persona.arcana] = [];
        }
        personaeByArcana_[persona.arcana].push(persona);
    }

    // Sort by level within each arcana
    for (let key in personaeByArcana_) {
        personaeByArcana_[key].sort((a, b) => a.level - b.level);
    }

    // Make sure World arcana is always present
    if (!personaeByArcana_['World']) {
        personaeByArcana_['World'] = [];
    }

    return personaeByArcana_;
})();

/**
 * Map for quick arcana fusion lookups
 * @type {Object.<string, Object.<string, string>>}
 */
const arcanaMap = (() => {
    let map = {};
    for (let i = 0; i < arcana2Combos.length; i++) {
        let combo = arcana2Combos[i];
        if (!map[combo.source[0]]) map[combo.source[0]] = {};
        map[combo.source[0]][combo.source[1]] = combo.result;

        if (!map[combo.source[1]]) map[combo.source[1]] = {};
        map[combo.source[1]][combo.source[0]] = combo.result;
    }
    return map;
})();

/**
 * Get the resulting arcana from fusing two arcanas
 * @param {string} arcana1 - First arcana
 * @param {string} arcana2 - Second arcana
 * @returns {string|undefined} Resulting arcana name
 */
const getResultArcana = (arcana1, arcana2) => {
    return arcanaMap[arcana1][arcana2];
};

/**
 * Special 2-persona fusion combos (extracted from specialCombos)
 * @type {import('../types').SpecialCombo[]}
 */
const special2Combos = (() => {
    let combos = [];
    for (let i = 0; i < specialCombos.length; i++) {
        if (specialCombos[i].sources.length == 2) {
            combos.push(specialCombos[i]);
        }
    }
    return combos;
})();

export {
    customPersonaList,
    customPersonaeByArcana,
    getResultArcana,
    special2Combos,
    personaMap
};
