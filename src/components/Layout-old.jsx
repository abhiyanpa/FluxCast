import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app-container">
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="navbar-brand">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 100 100" 
            fill="none"
          >
            <defs>
              <linearGradient id="fluxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#fluxGradient)" opacity="0.2" />
            <path 
              d="M 30 35 L 70 50 L 30 65 Z" 
              fill="url(#fluxGradient)" 
              stroke="url(#fluxGradient)" 
              strokeWidth="2"
            />
            <circle cx="70" cy="50" r="6" fill="url(#fluxGradient)" />
          </svg>
          FluxCast
        </Link>
        
        <nav className="navbar-nav">
          <Link to="/" className="nav-link">Browse</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>
      </header>

      {children}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 100 100" 
                fill="none"
              >
                <defs>
                  <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 30 35 L 70 50 L 30 65 Z" 
                  fill="url(#footerGradient)" 
                />
                <circle cx="70" cy="50" r="6" fill="url(#footerGradient)" />
              </svg>
              <span>FluxCast</span>
            </Link>
            <p className="footer-tagline">Modern Live Channel Directory</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Application</h3>
              <Link to="/">Browse Channels</Link>
              <Link to="/about">About</Link>
            </div>
            
            <div className="footer-column">
              <h3>Legal</h3>
              <Link to="/legal">Legal & Copyright</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
            
            <div className="footer-column">
              <h3>Information</h3>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">Source Code</a>
              <a href="mailto:contact@example.com">Contact</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 FluxCast by Abhiyan P A. All rights reserved.</p>
          <p className="footer-disclaimer">
            FluxCast does not host or store video content. All streams are from publicly available sources.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
