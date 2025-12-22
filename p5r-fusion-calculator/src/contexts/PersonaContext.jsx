import { createContext, useContext, useState } from 'react'
import {
  extractPersonas,
  getUniquePersonas,
  savePersonasToLocalStorage,
  loadPersonasFromLocalStorage,
  clearLocalStorage,
  saveFusableToLocalStorage,
  loadFusableImmediateFromLocalStorage
} from '../utils/personaExtractor'

const PersonaContext = createContext(null)

export function PersonaProvider({ children }) {
  const [personas, setPersonas] = useState(() => loadPersonasFromLocalStorage() || [])
  const [fusableImmediate, setFusableImmediate] = useState(() => loadFusableImmediateFromLocalStorage() || [])

  // Handle successful decryption - extract personas and save to state/localStorage
  const handleDecryptSuccess = (decryptedData) => {
    console.log('Decryption successful, extracting personas...')
    const extractedPersonas = extractPersonas(decryptedData)
    const uniquePersonas = getUniquePersonas(extractedPersonas)

    console.log(`Extracted ${extractedPersonas.length} persona entries`)
    console.log(`Found ${uniquePersonas.length} unique personas`)

    setPersonas(uniquePersonas)
    savePersonasToLocalStorage(uniquePersonas)

    // also save list of directly fusable personas
    const fusableRN = saveFusableToLocalStorage(uniquePersonas)
    setFusableImmediate(fusableRN)
  }

  // Clear persona inventory
  const handleClearInventory = () => {
    if (window.confirm('Are you sure you want to clear your persona inventory?')) {
      setPersonas([])
      setFusableImmediate([])
      clearLocalStorage()
      console.log('Persona inventory cleared')
    }
  }

  return (
    <PersonaContext.Provider value={{
      personas,
      fusableImmediate,
      handleDecryptSuccess,
      handleClearInventory
    }}>
      {children}
    </PersonaContext.Provider>
  )
}

// Custom hook to use the persona context
// eslint-disable-next-line react-refresh/only-export-components
export function usePersonas() {
  const context = useContext(PersonaContext)
  if (!context) {
    throw new Error('usePersonas must be used within a PersonaProvider')
  }
  return context
}
