import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../App.tsx'
import './styles/globals.css'
import './styles/components/ui/calendar.css'
import './styles/components/ui/calendar-empresa.css'
import './styles/components/ui/task-bar.css'

// Aplicar tema dark por defecto
document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

