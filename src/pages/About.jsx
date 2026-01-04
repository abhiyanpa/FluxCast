import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function About() {
  return (
    <>
      <Helmet>
        <title>About FluxCast | Modern Live Channel Directory</title>
        <meta name="description" content="FluxCast is a clean, modern interface for browsing publicly available streaming channels. Built with React and inspired by Apple TV design." />
        <link rel="canonical" href="https://streaming.abhiyanpa.in/about" />
        
        <meta property="og:title" content="About FluxCast" />
        <meta property="og:description" content="Learn more about FluxCast - a modern streaming channel directory with Apple TV-inspired design." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://streaming.abhiyanpa.in/about" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="About FluxCast" />
        <meta name="twitter:description" content="Learn more about FluxCast and its features." />
      </Helmet>

      <main className="content-main page-content">
        <div className="page-header">
          <h1>About FluxCast</h1>
          <p className="page-subtitle">A modern streaming channel directory</p>
        </div>

        <section className="content-section">
          <h2>What is FluxCast?</h2>
          <p>
            FluxCast is a clean, modern web application for browsing and streaming publicly available 
            live TV channels from around the world. With an Apple TV-inspired interface, FluxCast makes 
            it easy to discover and watch streaming content.
          </p>
        </section>

        <section className="content-section">
          <h2>Features</h2>
          <ul className="feature-list">
            <li>🎨 Clean, Apple TV-inspired design with dark theme</li>
            <li>🔍 Fast search across thousands of channels</li>
            <li>🌍 Filter by country and category</li>
            <li>📺 HLS streaming support with adaptive quality</li>
            <li>🖼️ Channel logos with beautiful gradient fallbacks</li>
            <li>📱 Fully responsive for desktop, tablet, and mobile</li>
            <li>⚡ Optimized performance for smooth browsing</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <strong>Frontend</strong>
              <p>React 18, Vite 5, React Router</p>
            </div>
            <div className="tech-item">
              <strong>Streaming</strong>
              <p>HLS.js for adaptive video playback</p>
            </div>
            <div className="tech-item">
              <strong>Backend</strong>
              <p>Express.js API with data caching</p>
            </div>
            <div className="tech-item">
              <strong>Design</strong>
              <p>Custom CSS with tvOS-inspired animations</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Data Sources</h2>
          <p>
            FluxCast uses data from <strong>IPTV-org</strong>, a community-driven project that 
            maintains an open database of publicly available IPTV channels from around the world.
          </p>
          <p className="mt-2">
            All channel information, logos, and stream URLs are sourced from the 
            <a href="https://github.com/iptv-org/iptv" target="_blank" rel="noopener noreferrer" className="text-link"> IPTV-org GitHub repository</a>. 
            We do not host, store, or modify any video content - all streams are direct links to 
            publicly available sources maintained by the community.
          </p>
          <p className="mt-2">
            <strong>Attribution:</strong> Channel data provided by IPTV-org under 
            <a href="https://unlicense.org/" target="_blank" rel="noopener noreferrer" className="text-link"> The Unlicense</a>.
          </p>
        </section>

        <section className="content-section">
          <h2>Privacy & Analytics</h2>
          <p>
            FluxCast respects your privacy. We do not use analytics, tracking cookies, or collect 
            any personal data. There are no user accounts or login systems. Your viewing habits 
            remain completely private.
          </p>
        </section>

        <section className="content-section">
          <h2>Created By</h2>
          <p>
            FluxCast is developed and maintained by <strong>Abhiyan P A</strong>.
          </p>
          <p className="mt-2">
            <Link to="/legal" className="text-link">Legal & Copyright</Link>
            {' • '}
            <Link to="/privacy" className="text-link">Privacy Policy</Link>
          </p>
        </section>

        <div className="page-actions">
          <Link to="/" className="btn-primary">Browse Channels</Link>
        </div>
      </main>
    </>
  )
}

export default About
