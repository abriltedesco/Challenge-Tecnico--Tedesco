import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JuegoContadorV3 from './GPT-5.4/JuegoContadorV3.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JuegoContadorV3 />
  </StrictMode>,
)
