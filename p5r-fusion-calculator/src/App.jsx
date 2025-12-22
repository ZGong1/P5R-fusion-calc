import { Routes, Route } from 'react-router-dom'
import { PersonaProvider } from './contexts/PersonaContext'
import Navbar from './components/Navbar'
import FileUpload from './components/FileUpload'
import PersonaInventory from './components/PersonaInventory'
import AllPersonae from './components/AllPersonae'
import Fusions from './components/Fusions'
import './App.css'

function App() {

  return (
    <PersonaProvider>
      <div className="App">
        <Navbar />

        <div className="app-content">
          <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/inventory" element={<PersonaInventory />} />
            <Route path="/all-personas" element={<AllPersonae />} />
            <Route path="/fusion" element={<Fusions />} />
          </Routes>
        </div>
      </div>
    </PersonaProvider>
  )
}

export default App
