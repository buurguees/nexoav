import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../App.tsx'
import './styles/globals.css'
// dark-theme.css ya no es necesario - los temas se manejan mediante clases en globals.css
import './styles/components/ui/calendar.css'
import './styles/components/ui/calendar-empresa.css'
import './styles/components/ui/calendar-empresa-tablet.css'
import './styles/components/ui/calendar-empresa-tablet-horizontal.css'
import './styles/components/ui/calendar-empresa-mobile.css'
import './styles/components/ui/calendar-tablet.css'
import './styles/components/ui/calendar-tablet-horizontal.css'
import './styles/components/ui/calendar-mobile.css'
import './styles/components/ui/task-bar.css'
import './styles/components/tablet-portrait.css'
import './styles/components/tablet-horizontal.css'
import './styles/components/mobile.css'

// Tema silk es light por defecto (no aplicar clase dark)
// document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

