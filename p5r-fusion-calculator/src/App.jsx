import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import FileUpload from './components/FileUpload'
import PersonaInventory from './components/PersonaInventory'
import AllPersonae from './components/AllPersonae'
import Fusions from './components/Fusions'
import {
  extractPersonas,
  getUniquePersonas,
  savePersonasToLocalStorage,
  loadPersonasFromLocalStorage,
  clearLocalStorage,
  saveFusableToLocalStorage, loadFusableImmediateFromLocalStorage
} from './utils/personaExtractor'
import './App.css'

function App() {
  const location = useLocation()
  const pathname = location.pathname

  // TODO: put these into a context provider so they don't need to be
  // drilled or passed through so many levels of components
  const [personas, setPersonas] = useState(() => loadPersonasFromLocalStorage() || [])
  const [fusableImmediate, setFusableImmediate] = useState(() => loadFusableImmediateFromLocalStorage() || [])

  // Handle successful decryption - extract personas and switch to inventory tab
  // TODO: Could this be in a util file and just be imported where needed
  // to keep App.jsx cleaner?
  const handleDecryptSuccess = (decryptedData) => {
    console.log('Decryption successful, extracting personas...')
    const extractedPersonas = extractPersonas(decryptedData)
    const uniquePersonas = getUniquePersonas(extractedPersonas)

    console.log(`Extracted ${extractedPersonas.length} persona entries`)
    console.log(`Found ${uniquePersonas.length} unique personas`)

    setPersonas(uniquePersonas)
    savePersonasToLocalStorage(uniquePersonas)
    
    // also save list of directly fusable (has both components to make in compendium) personas
    // saved to state below, and saved to localStorage in the function that also returns the list
    const fusableRN = saveFusableToLocalStorage(uniquePersonas)
    setFusableImmediate(fusableRN)
  }

  // Clear persona inventory
  // TODO: Could this be in a util file and just be imported where needed
  // to keep App.jsx cleaner?
  const handleClearInventory = () => {
    if (window.confirm('Are you sure you want to clear your persona inventory?')) {
      setPersonas([])
      clearLocalStorage()
      console.log('Persona inventory cleared')
    }
  }

  return (
    <div className="App">
      <Navbar />

      <div className="app-content">
        <div style={{ display: pathname === '/' ? 'block' : 'none' }}>
          <FileUpload onDecryptSuccess={handleDecryptSuccess} />
        </div>

        <div style={{ display: pathname === '/inventory' ? 'block' : 'none' }}>
          <PersonaInventory
            personas={personas}
            onClear={handleClearInventory}/>
        </div>

        <div style={{ display: pathname === '/all-personas' ? 'block' : 'none' }}>
          <AllPersonae />
        </div>

        <div style={{ display: pathname === '/fusion' ? 'block' : 'none' }}>
          <Fusions
            personas={personas}
            fusableImmediate={fusableImmediate}/>
        </div>
      </div>
    </div>
  )
}

export default App
