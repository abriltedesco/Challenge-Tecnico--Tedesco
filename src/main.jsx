import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JuegoContadorV3 from './GPT-5.4/JuegoContadorV3.jsx'
import JuegoContador from './sinIA/JuegoContadorV3.jsx'
import JuegoContadorV2 from './Opus4.6/JuegoContadorV2.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JuegoContadorV2 />
  </StrictMode>,
)
