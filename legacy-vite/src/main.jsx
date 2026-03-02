import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './state/auth.jsx'
import { EntitlementsProvider } from './state/entitlements.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EntitlementsProvider>
          <App />
        </EntitlementsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
