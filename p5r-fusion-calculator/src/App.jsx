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
  clearPersonasFromLocalStorage
} from './utils/personaExtractor'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('saveUpload')
  // personas is important because it is the inventory of actually owned personas
  const [personas, setPersonas] = useState([])
  const [selectedPersona, setSelectedPersona] = useState("")
  const [selectedFusion, setSelectedFusion] = useState("")

  // Load personas from localStorage on mount
  useEffect(() => {
    const stored = loadPersonasFromLocalStorage()
    if (stored && stored.length > 0) {
      setPersonas(stored)
      console.log(`Loaded ${stored.length} personas from localStorage`)
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
            setSelectedFusion={setSelectedFusion}/>
        }
      </div>
    </div>
  )
}

export default App
