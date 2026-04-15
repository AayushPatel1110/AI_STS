import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './providers/AuthProvider'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!PUBLISHABLE_KEY) {
  throw new Error('Missing publishable key. Please add it to your .env file')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl='/'
      appearance={{
        variables: {
          colorPrimary: '#a855f7',
          colorBackground: '#0d0d1a',
          colorText: '#f0f0f0',
          colorTextSecondary: 'rgba(255,255,255,0.55)',
          colorTextOnPrimaryBackground: '#ffffff',
          colorNeutral: '#ffffff',          // ← fixes ALL derived label/placeholder/divider dark text
          colorInputBackground: 'rgba(255,255,255,0.07)',
          colorInputText: '#f0f0f0',
          colorShimmer: 'rgba(255,255,255,0.05)',
          borderRadius: '0.75rem',
          fontFamily: 'Geist Variable, sans-serif',
        },
        elements: {
          card: 'bg-[#0d0d1a] border border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.1)]',
          formButtonPrimary: 'bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
          footerActionLink: 'text-[#a855f7] hover:text-[#c084fc]',
          formFieldLabel: 'text-white/80',
          formFieldHintText: 'text-white/50',
          formFieldErrorText: 'text-red-400',
          identityPreviewText: 'text-white/80',
          dividerText: 'text-white/40',
          headerTitle: 'text-white',
          headerSubtitle: 'text-white/60',
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ClerkProvider>
  </StrictMode>,
)
