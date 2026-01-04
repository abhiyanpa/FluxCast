import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function Legal() {
  return (
    <>
      <Helmet>
        <title>Legal & Copyright | FluxCast</title>
        <meta name="description" content="Legal information, copyright notices, and disclaimers for FluxCast streaming directory." />
        <link rel="canonical" href="https://streaming.abhiyanpa.in/legal" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main className="content-main page-content">
        <div className="page-header">
          <h1>Legal & Copyright</h1>
          <p className="page-subtitle">Important information about FluxCast</p>
        </div>

        <section className="content-section">
          <h2>Service Disclaimer</h2>
          <p>
            FluxCast is a channel directory and streaming interface that provides access to 
            publicly available streaming content. <strong>We do not host, store, or transmit any 
            video content.</strong> All stream URLs point to external sources that are publicly 
            accessible on the internet.
          </p>
          <p className="mt-2">
            FluxCast acts as an aggregator and interface for publicly available data. We are not 
            responsible for the content, availability, or legality of the streams provided by 
            third-party sources.
          </p>
        </section>

        <section className="content-section">
          <h2>Content Sources & Attribution</h2>
          <p>
            FluxCast uses channel data from <strong>IPTV-org</strong> 
            (<a href="https://github.com/iptv-org/iptv" target="_blank" rel="noopener noreferrer">github.com/iptv-org/iptv</a>), 
            a community-driven open-source project that maintains a database of publicly available 
            IPTV channels.
          </p>
          <ul className="legal-list">
            <li><strong>Data Source:</strong> IPTV-org GitHub repository</li>
            <li><strong>License:</strong> The Unlicense (public domain)</li>
            <li><strong>Content Type:</strong> Publicly accessible streaming URLs</li>
            <li><strong>Our Role:</strong> Directory and interface only - no content hosting</li>
          </ul>
          <p className="mt-2">
            We fetch channel information, logos, and stream URLs directly from IPTV-org's API. 
            We do not create, modify, host, or control any stream content. All streams link 
            directly to their original public sources.
          </p>
        </section>

        <section className="content-section">
          <h2>Copyright & DMCA</h2>
          <p>
            FluxCast respects intellectual property rights. If you believe that any content 
            accessible through FluxCast infringes your copyright:
          </p>
          <ol className="legal-list">
            <li>
              <strong>FluxCast does not host content</strong> - We only provide links to publicly 
              available streams. Copyright claims should be directed to the source hosting the content.
            </li>
            <li>
              If you believe a link should be removed from our directory, please contact us with 
              the specific channel information and proof of ownership.
            </li>
            <li>
              We will review all valid DMCA takedown requests and remove links to content where 
              appropriate.
            </li>
          </ol>
        </section>

        <section className="content-section">
          <h2>Third-Party Services</h2>
          <p>
            FluxCast may contain links to external websites and streaming services. We are not 
            responsible for:
          </p>
          <ul className="legal-list">
            <li>The content, privacy policies, or practices of third-party sites</li>
            <li>The availability or quality of external streams</li>
            <li>Any damages or losses caused by use of third-party services</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Use at Your Own Risk</h2>
          <p>
            FluxCast is provided "as is" without warranties of any kind. Users are responsible for:
          </p>
          <ul className="legal-list">
            <li>Complying with local laws regarding streaming content in their jurisdiction</li>
            <li>Verifying the legality of accessing specific channels or content</li>
            <li>Understanding that stream availability and quality may vary</li>
            <li>Taking appropriate security measures when accessing external content</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, FluxCast and its creators shall not be liable 
            for any damages arising from:
          </p>
          <ul className="legal-list">
            <li>Use or inability to use the service</li>
            <li>Content provided by third-party sources</li>
            <li>Interruption or cessation of service</li>
            <li>Errors, inaccuracies, or omissions in channel data</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of FluxCast 
            constitutes acceptance of any changes.
          </p>
        </section>

        <section className="content-section">
          <h2>Contact</h2>
          <p>
            For legal inquiries, DMCA takedown requests, or copyright concerns, please contact 
            the site administrator through appropriate channels.
          </p>
          <p className="mt-2">
            <strong>Last Updated:</strong> January 2025
          </p>
        </section>

        <div className="page-actions">
          <Link to="/" className="btn-secondary">Back to Home</Link>
          <Link to="/privacy" className="btn-secondary">Privacy Policy</Link>
        </div>
      </main>
    </>
  )
}

export default Legal
