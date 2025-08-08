import React from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react';
import { AppProvider } from './context/AppContext.jsx';
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  const errorMessage = import.meta.env.PROD 
    ? 'Missing Clerk Publishable Key in production environment. Please check your environment variables.'
    : 'Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file'
  console.error(errorMessage);
  throw new Error(errorMessage)
}

// Log environment for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('Environment:', import.meta.env.MODE)
  console.log('Clerk Key Type:', PUBLISHABLE_KEY.startsWith('pk_live_') ? 'Production' : 'Development')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
    </BrowserRouter>
  </ClerkProvider>
);
