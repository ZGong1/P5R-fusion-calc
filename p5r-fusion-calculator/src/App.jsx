import { useState, useEffect } from 'react'
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
  clearPersonasFromLocalStorage,
  saveFusableToLocalStorage, loadFusableImmediateFromLocalStorage
} from './utils/personaExtractor'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('saveUpload')
  // list of actually owned personas by the user
  const [personas, setPersonas] = useState([])
  const [fusableImmediate, setFusableImmediate] = useState([])
  const [selectedPersona, setSelectedPersona] = useState("")
  const [selectedFusion, setSelectedFusion] = useState("")

  // Load data from localStorage
  useEffect(() => {
    // Load owned personas from local storage if they exist
    const stored = loadPersonasFromLocalStorage()
    if (stored && stored.length > 0) {
      setPersonas(stored)
      console.log(`Loaded ${stored.length} owned personas from localStorage`)
    }

    // Load fusable personas from local storage if they exist
    const storedFusableImmediate = loadFusableImmediateFromLocalStorage()
    if (stored && stored.length > 0) {
      setFusableImmediate(storedFusableImmediate)
      console.log(`Loaded ${stored.length} fusable personas from localStorage`)
    }
  }, [])

  // Handle successful decryption - extract personas and switch to inventory tab
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
  const handleClearInventory = () => {
    if (window.confirm('Are you sure you want to clear your persona inventory?')) {
      setPersonas([])
      clearPersonasFromLocalStorage()
      console.log('Persona inventory cleared')
    }
  }

  return (
    <div className="App">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} />

      <div className="app-content">
        {activeTab === 'saveUpload' && (
          <FileUpload onDecryptSuccess={handleDecryptSuccess} />
        )}

        {activeTab === 'inventory' && (
          <PersonaInventory 
            personas={personas} 
            onClear={handleClearInventory} 
            setActiveTab={setActiveTab}
            setSelectedPersona={setSelectedPersona}/>
        )}

        {activeTab === 'allPersonae' && (
          <AllPersonae 
            selectedPersona={selectedPersona} 
            setSelectedPersona={setSelectedPersona}/>
        )}

        {activeTab === 'fusion' &&
          <Fusions
            selectedFusion={selectedFusion}
            setSelectedFusion={setSelectedFusion}
            personas={personas}
            fusableImmediate={fusableImmediate}/>
        }
      </div>
    </div>
  )
}

export default App
