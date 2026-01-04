import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Player from '../Player'

// Use original IPTV-org API
const IPTV_API_BASE = 'https://iptv-org.github.io/api'

function Channel() {
  const { channelId } = useParams()
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [logo, setLogo] = useState(null)

  useEffect(() => {
    fetchChannel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  const fetchChannel = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch channels, streams, and logos
      const [channelsRes, streamsRes, logosRes] = await Promise.all([
        fetch(`${IPTV_API_BASE}/channels.json`),
        fetch(`${IPTV_API_BASE}/streams.json`),
        fetch(`${IPTV_API_BASE}/logos.json`)
      ])

      if (!channelsRes.ok || !streamsRes.ok) {
        throw new Error('Failed to fetch data from IPTV-org API')
      }

      const channelsData = await channelsRes.json()
      const streamsData = await streamsRes.json()
      const logosData = logosRes.ok ? await logosRes.json() : []
      
      // Find the specific channel
      const foundChannel = channelsData.find(c => c.id === channelId)
      
      if (!foundChannel) {
        setError('Channel not found')
        setLoading(false)
        return
      }

      // Find stream for this channel
      const stream = streamsData.find(s => s.channel === channelId)
      
      if (!stream) {
        setError('No stream available for this channel')
        setLoading(false)
        return
      }

      // Find logo for this channel
      const channelLogo = logosData.find(l => {
        if (stream.feed) {
          return l.channel === channelId && l.feed === stream.feed
        }
        return l.channel === channelId && !l.feed
      })

      if (channelLogo) {
        setLogo(channelLogo.url)
      }

      // Merge channel data with stream data
      const channelWithStream = {
        id: foundChannel.id,
        name: foundChannel.name,
        alt_names: foundChannel.alt_names || [],
        network: foundChannel.network,
        country: foundChannel.country,
        categories: foundChannel.categories || [],
        category: foundChannel.categories?.[0] || 'general',
        is_nsfw: foundChannel.is_nsfw,
        website: foundChannel.website,
        stream_url: stream.url,
        stream_title: stream.title,
        stream_quality: stream.quality,
        referrer: stream.referrer,
        user_agent: stream.user_agent,
        feed: stream.feed
      }

      setChannel(channelWithStream)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching channel:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading... | FluxCast</title>
        </Helmet>
        <div className="loading-screen">
          <div className="loading-content">
            <div className="spinner"></div>
            <h2>Loading Channel</h2>
          </div>
        </div>
      </>
    )
  }

  if (error || !channel) {
    return (
      <>
        <Helmet>
          <title>Channel Not Found | FluxCast</title>
        </Helmet>
        <div className="error-screen">
          <div className="error-content">
            <div className="error-icon">📺</div>
            <h2>Channel Not Found</h2>
            <p className="error-message">{error || 'The channel you\'re looking for doesn\'t exist.'}</p>
            <Link to="/" className="btn-primary">Browse Channels</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{channel.name} | FluxCast</title>
        <meta name="description" content={`Watch ${channel.name} live streaming. ${channel.network ? `Network: ${channel.network}. ` : ''}${channel.country ? `Country: ${channel.country}.` : ''}`} />
        <link rel="canonical" href={`https://streaming.abhiyanpa.in/channel/${channelId}`} />
        
        <meta property="og:title" content={`${channel.name} - Live Stream`} />
        <meta property="og:description" content={`Watch ${channel.name} live on FluxCast`} />
        <meta property="og:type" content="video.other" />
        <meta property="og:url" content={`https://streaming.abhiyanpa.in/channel/${channelId}`} />
        {logo && <meta property="og:image" content={logo} />}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${channel.name} - Live Stream`} />
        {logo && <meta name="twitter:image" content={logo} />}
      </Helmet>

      <main className="content-main">
        <div className="channel-page">
          <div className="back-button">
            <Link to="/" className="btn-back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Channels
            </Link>
          </div>

          <Player channel={channel} onClose={() => window.history.back()} />

          <div className="channel-info">
            <div className="channel-header">
              {logo && (
                <img 
                  src={logo} 
                  alt={channel.name}
                  className="channel-logo-large"
                  loading="lazy"
                />
              )}
              <div>
                <h1 className="channel-title">{channel.name}</h1>
                {channel.network && (
                  <p className="channel-network">{channel.network}</p>
                )}
              </div>
            </div>

            <div className="channel-meta">
              {channel.country && (
                <div className="meta-item">
                  <span className="meta-label">Country</span>
                  <span className="meta-value">{channel.country}</span>
                </div>
              )}
              
              {channel.languages && channel.languages.length > 0 && (
                <div className="meta-item">
                  <span className="meta-label">Languages</span>
                  <span className="meta-value">{channel.languages.join(', ')}</span>
                </div>
              )}
              
              {channel.categories && channel.categories.length > 0 && (
                <div className="meta-item">
                  <span className="meta-label">Categories</span>
                  <div className="category-tags">
                    {channel.categories.map(cat => (
                      <span key={cat} className="category-tag">{cat}</span>
                    ))}
                  </div>
                </div>
              )}

              {channel.is_nsfw && (
                <div className="meta-item">
                  <span className="nsfw-badge">🔞 Adult Content</span>
                </div>
              )}
            </div>

            {channel.website && (
              <div className="channel-website">
                <a 
                  href={channel.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Visit Official Website →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Channel
