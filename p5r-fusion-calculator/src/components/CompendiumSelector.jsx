import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'
import { customPersonaList } from '../fusion-calculator-core/DataUtil'

const personae = customPersonaList

function CompendiumSelector() {
  const [selectedPerson, setSelectedPerson] = useState(personae[0])
  const [query, setQuery] = useState('')

  console.log("personae: ", personae)

  let filteredPersonae =
    query === ''
      ? personae
      : personae.filter((persona) => {
          return persona.name.toLowerCase().includes(query.toLowerCase())
        })

    if (filteredPersonae.length > 20) {
        filteredPersonae = []
    }

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
      <ComboboxInput
        aria-label="Assignee"
        displayValue={(persona) => persona?.name}
        virtual={{ options: filteredPersonae }}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="bottom" className="border empty:invisible color:black">
        {filteredPersonae.map((persona) => (
          <ComboboxOption key={persona.id} value={persona} className="data-focus:bg-blue-100 color:black">
            {persona.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}

export default CompendiumSelector