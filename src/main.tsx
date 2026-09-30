import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { IndustriesPage, ServicesPage } from './pages/services/ServicesPage'
import './styles/global.css'

// The site opens on the services page; /industries is the other page. The old menu demo lives at /lab.
const pages: Record<string, () => React.JSX.Element> = { '': ServicesPage, services: ServicesPage, industries: IndustriesPage, lab: App }
const Page = pages[location.pathname.replace(/^\/|\/$/g, '')] ?? ServicesPage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
