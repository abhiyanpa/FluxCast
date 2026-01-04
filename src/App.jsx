import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, createContext, useContext, lazy, Suspense } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import './style.css'

// Lazy load pages that are not immediately needed
const About = lazy(() => import('./pages/About'))
const Legal = lazy(() => import('./pages/Legal'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Channel = lazy(() => import('./pages/Channel'))

// Loading fallback component
const PageLoader = () => (
  <div className="loading-screen">
    <div className="loading-content">
      <div className="spinner"></div>
      <h2>Loading...</h2>
    </div>
  </div>
)

// Theme Context
const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

function App() {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.add(savedTheme)
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }, [theme])

  const themeValue = { theme, toggleTheme }

  return (
    <ThemeContext.Provider value={themeValue}>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/channel/:channelId" element={<Channel />} />
          </Routes>
        </Suspense>
      </Layout>
    </ThemeContext.Provider>
  )
}

export default App
