import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'
import { customPersonaList } from '../fusion-calculator-core/DataUtil'
import './CompendiumSelector.css'

const personae = customPersonaList.map( (object) => object.name )

function CompendiumSelector( {selectedPersona, setSelectedPersona} ) {
  const [query, setQuery] = useState('')

  const MAXIMUM_COMBOBOX_AUTOFILL = 20

//   console.log("personae: ", personae)

  let filteredPersonae =
    query === ''
      ? personae
      : personae.filter((persona) => {
          return persona.toLowerCase().includes(query.toLowerCase())
        })
  // console.log("filteredPersonae: ", filteredPersonae)
  // console.log("personae: ", personae)

  // Headless UI doesn't implement a proper virtual scrolling implementation, so I'm just not passing the options to the component until its a reasonable size
  if (filteredPersonae.length > MAXIMUM_COMBOBOX_AUTOFILL) {
      filteredPersonae = []
  }

  return (
    <Combobox value={selectedPersona} onChange={setSelectedPersona} onClose={() => setQuery('')}>
      <ComboboxInput
        aria-label="Assignee"
        displayValue={(persona) => persona}
        virtual={{ options: filteredPersonae }} // Prevents from rendering everything in background (default behaviour)
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="bottom" className="border empty:invisible color:black">
        {filteredPersonae.map((persona) => (
          <ComboboxOption key={persona} value={persona} className="data-focus:bg-blue-100 color:black">
            {persona}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}

export default CompendiumSelector