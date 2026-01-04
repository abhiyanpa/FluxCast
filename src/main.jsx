import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './style.css'
import './firebase' // Initialize Firebase

// Capacitor imports
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { Capacitor } from '@capacitor/core'

// Initialize Capacitor plugins for mobile
if (Capacitor.isNativePlatform()) {
  // Set status bar style
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
  StatusBar.setBackgroundColor({ color: '#000000' }).catch(() => {})
  
  // Hide splash screen after app loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      SplashScreen.hide().catch(() => {})
    }, 1000)
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
