/**
 * Apply filters to fusion recipes
 * @param {Array} recipes - Array of fusion recipes
 * @param {Object} filters - Filter options
 * @param {boolean} filters.hideRare - Hide recipes with rare personas
 * @param {boolean} filters.hideDLC - Hide recipes with DLC personas
 * @param {boolean} filters.hideNonOwned - Show only recipes with owned personas
 * @param {boolean} filters.showMixedOnly - Show only recipes with owned or fusable personas
 * @param {Array} personas - User's owned personas
 * @param {Array} fusableImmediate - Directly fusable personas
 * @returns {Array} Filtered recipes
 */
export function applyFusionFilters(recipes, filters, personas, fusableImmediate) {
  if (!recipes) return null

  let filtered = recipes

  // Filter rares
  if (filters.hideRare) {
    filtered = filtered.filter(recipe => {
      return !recipe.sources.some(source => source.rare)
    })
  }

  // Filter DLC
  if (filters.hideDLC) {
    filtered = filtered.filter(recipe => {
      return !recipe.sources.some(source => source.dlc)
    })
  }

  // Filter recipes with non-owned personas
  if (filters.hideNonOwned) {
    filtered = filtered.filter(recipe => {
      return recipe.sources.every(source =>
        personas?.find(persona => persona.name === source.name)
      )
    })
  }

  // Filter to show only recipes where all components are owned or fusable
  if (filters.showMixedOnly) {
    filtered = filtered.filter(recipe => {
      return recipe.sources.every(source => {
        const isOwned = personas?.find(persona => persona.name === source.name)
        const isFusable = fusableImmediate?.find(persona => persona === source.name)
        return isOwned || isFusable
      })
    })
  }

  return filtered
}
