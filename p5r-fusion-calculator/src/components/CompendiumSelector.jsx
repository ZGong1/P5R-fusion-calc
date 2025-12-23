import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'
import './CompendiumSelector.css'

/**
 * Generic selector component for autocomplete dropdown
 * @param {Array} items - Array of string items to select from
 * @param {String} selectedItem - Currently selected item
 * @param {Function} setSelectedItem - Function to update selected item
 * @param {String} ariaLabel - Accessible label for the input (optional, defaults to "Select item")
 */
function CompendiumSelector( {items, selectedItem, setSelectedItem, ariaLabel = "Select item"} ) {
  const [query, setQuery] = useState('')

  const MAXIMUM_COMBOBOX_AUTOFILL = 20

  let filteredItems =
    query === ''
      ? items
      : items.filter((item) => {
          return item.toLowerCase().includes(query.toLowerCase())
        })

  // Headless UI doesn't implement a proper virtual scrolling implementation, so I'm just not passing the options to the component until its a reasonable size
  if (filteredItems.length > MAXIMUM_COMBOBOX_AUTOFILL) {
      filteredItems = []
  }

  return (
    <Combobox value={selectedItem} onChange={setSelectedItem} onClose={() => setQuery('')}>
      <ComboboxInput
        aria-label={ariaLabel}
        displayValue={(item) => item}
        virtual={{ options: filteredItems }} // Prevents from rendering everything in background (default behaviour)
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="bottom" className="border empty:invisible color:black">
        {filteredItems.map((item) => (
          <ComboboxOption key={item} value={item} className="data-focus:bg-blue-100 color:black">
            {item}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}

export default CompendiumSelector