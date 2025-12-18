import CompendiumSelector from './CompendiumSelector'
import './Fusions.css'


function Fusions({ selectedFusion, setSelectedFusion }) {

  return (
    <>
      Please select which Persona you would like to fuse:
      <CompendiumSelector selectedPersona={selectedFusion} setSelectedPersona={setSelectedFusion}/> <br/>

      You have selected {selectedFusion} for a fusion calculation
    </>
  )

}

export default Fusions