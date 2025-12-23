import { createContext, useContext, useState } from 'react'

import {
  extractPersonas, extractSaveMetadata,
  getUniquePersonas
} from '../utils/personaExtractor'

import {
  savePersonasToLocalStorage,
  loadPersonasFromLocalStorage,
  clearLocalStorage,
  saveFusableToLocalStorage,
  loadFusableImmediateFromLocalStorage, loadMetaDataFromLocalStorage, saveMetaDataToLocalStorage
} from '../utils/storage'

const PersonaContext = createContext(null)

export function PersonaProvider({ children }) {
  const [personas, setPersonas] = useState(() => loadPersonasFromLocalStorage() || [])
  const [fusableImmediate, setFusableImmediate] = useState(() => loadFusableImmediateFromLocalStorage() || [])
  const [saveMetaData, setSaveMetaData] = useState(() => loadMetaDataFromLocalStorage())

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

    // Save metadata section
    // const metadata = getSaveMetadata(decryptedData)
    const saveMetaData = extractSaveMetadata(decryptedData)
    setSaveMetaData(saveMetaData)
    saveMetaDataToLocalStorage(saveMetaData)
  }

  // Clear persona inventory
  const handleClearInventory = () => {
    if (window.confirm('Are you sure you want to clear your persona inventory?')) {
      setPersonas([])
      setFusableImmediate([])
      setSaveMetaData({})
      clearLocalStorage()
      console.log('Persona inventory cleared')
    }
  }

  return (
    <PersonaContext.Provider value={{
      personas,
      fusableImmediate,
      saveMetaData,
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
