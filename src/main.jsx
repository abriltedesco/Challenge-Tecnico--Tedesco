import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JuegoContadorV2 from './JuegoContadorV2.jsx'
import JuegoContador from './sinIA/JuegoContador.jsx'
import JuegoContadorV3 from './JuegoContadorV3.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JuegoContador />
  </StrictMode>,
)
