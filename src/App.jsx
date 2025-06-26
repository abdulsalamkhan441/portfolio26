import './App.css'
import LandingPage from './pages/Landingpage'
import CardPage1 from './pages/cardpage1'
import CardPage2 from './pages/cardpage2'
import CardPage3 from './pages/cardpage3'
import { Routes, Route } from 'react-router-dom'

function App() {
  return(
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/CardPage1" element={<CardPage1/>} />
      <Route path="/CardPage2" element={<CardPage2/>} />
      <Route path="/CardPage3" element={<CardPage3/>} />
    </Routes>
  )  
}

export default App
