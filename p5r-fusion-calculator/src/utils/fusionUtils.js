import { personaMap } from '../fusion-calculator-core/DataUtil';

/**
 * Returns Boolean if a persona is fusable (there is at least one branch below where both personas are owned)
 * @param {String} toFuse - String of the name of the persona you want to check
 * @param {Array} ownedPersonas - Array with strings of the personas the player has
 * @param {Object} calculator - A setup fusion calculator object
 * @returns {Boolean} True/False if there is an immediate path to fuse with owned personas
 */
export function fusable(toFuse, ownedPersonas, calculator) {
  const toFuseWithData = personaMap[toFuse]
  // console.log("toFuseWithData: ", toFuseWithData)
  const possibleFusions = calculator.getRecipes(toFuseWithData)

  // console.log("possibleFusions: ", possibleFusions)

  // Create a Set of owned persona names for O(1) lookup
  const ownedSet = new Set(ownedPersonas.map(p => p.name))

  for (let fusion of possibleFusions) {
    // Check if ALL sources are owned
    const isFusionFound = fusion.sources.every(source => ownedSet.has(source.name))

    if (isFusionFound) { return true }
  }

  return false
}
