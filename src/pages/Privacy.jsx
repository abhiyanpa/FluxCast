import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | FluxCast</title>
        <meta name="description" content="FluxCast privacy policy - No tracking, no cookies, no data collection. Your viewing is completely private." />
        <link rel="canonical" href="https://streaming.abhiyanpa.in/privacy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main className="content-main page-content">
        <div className="page-header">
          <h1>Privacy Policy</h1>
          <p className="page-subtitle">Your privacy is important to us</p>
        </div>

        <section className="content-section highlight-section">
          <h2>✨ Privacy-First Approach</h2>
          <p>
            <strong>FluxCast does not collect, store, or track any personal data.</strong> There 
            are no analytics, no tracking cookies, no user accounts, and no login system. Your 
            viewing habits remain completely private.
          </p>
        </section>

        <section className="content-section">
          <h2>What We Don't Collect</h2>
          <ul className="privacy-list">
            <li>❌ No user accounts or personal information</li>
            <li>❌ No tracking cookies or analytics</li>
            <li>❌ No viewing history or watch data</li>
            <li>❌ No IP address logging</li>
            <li>❌ No behavioral tracking</li>
            <li>❌ No third-party advertising trackers</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>How FluxCast Works</h2>
          <p>
            FluxCast operates as a client-side application. When you use FluxCast:
          </p>
          <ol className="privacy-list">
            <li>Your browser loads the FluxCast interface</li>
            <li>Channel data is fetched from our API (no personal data involved)</li>
            <li>When you play a channel, your browser connects directly to the source stream</li>
            <li>We never see or log which channels you watch</li>
          </ol>
        </section>

        <section className="content-section">
          <h2>Technical Data</h2>
          <p>
            Standard web server logs may temporarily record:
          </p>
          <ul className="privacy-list">
            <li>General API requests (for service functionality)</li>
            <li>Error logs (for debugging purposes only)</li>
          </ul>
          <p className="mt-2">
            These logs do not contain personal information and are not used for tracking or 
            analytics. They are automatically purged on a regular basis.
          </p>
        </section>

        <section className="content-section">
          <h2>Third-Party Streams</h2>
          <p>
            When you play a channel, your browser connects directly to the streaming source. 
            FluxCast does not act as a proxy or intermediary. The privacy policies of those 
            third-party services apply when you access their streams.
          </p>
          <p className="mt-2">
            <strong>Important:</strong> We cannot control or be responsible for the privacy 
            practices of external streaming sources.
          </p>
        </section>

        <section className="content-section">
          <h2>Local Storage</h2>
          <p>
            FluxCast may use browser local storage to:
          </p>
          <ul className="privacy-list">
            <li>Remember your last selected filters (country, category)</li>
            <li>Store player preferences (volume level, quality settings)</li>
          </ul>
          <p className="mt-2">
            This data never leaves your browser and is not transmitted to any server. You can 
            clear it at any time through your browser settings.
          </p>
        </section>

        <section className="content-section">
          <h2>Cookies</h2>
          <p>
            FluxCast does not use cookies for tracking or analytics. Any cookies used are strictly 
            functional and necessary for the service to operate (such as maintaining session state 
            for API requests).
          </p>
        </section>

        <section className="content-section">
          <h2>Data Security</h2>
          <p>
            Since we don't collect personal data, there's no personal data to secure. However, 
            we follow security best practices for our infrastructure:
          </p>
          <ul className="privacy-list">
            <li>HTTPS encryption for all connections</li>
            <li>Regular security updates and patches</li>
            <li>Secure API endpoints with rate limiting</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Children's Privacy</h2>
          <p>
            FluxCast does not knowingly collect data from anyone, including children under 13. 
            Since we don't collect personal information, COPPA compliance is not applicable.
          </p>
        </section>

        <section className="content-section">
          <h2>Your Rights</h2>
          <p>
            Since we don't collect your data, there's no data to access, modify, or delete. You 
            can use FluxCast with complete anonymity.
          </p>
        </section>

        <section className="content-section">
          <h2>Changes to Privacy Policy</h2>
          <p>
            If we ever change our privacy practices, we will update this page. We are committed 
            to maintaining a privacy-first approach.
          </p>
          <p className="mt-2">
            <strong>Last Updated:</strong> January 2025
          </p>
        </section>

        <section className="content-section">
          <h2>Questions?</h2>
          <p>
            If you have questions about this privacy policy, please reach out through appropriate 
            channels.
          </p>
        </section>

        <div className="page-actions">
          <Link to="/" className="btn-secondary">Back to Home</Link>
          <Link to="/legal" className="btn-secondary">Legal Information</Link>
        </div>
      </main>
    </>
  )
}

export default Privacy
