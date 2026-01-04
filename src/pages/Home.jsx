import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import ChannelCard from '../ChannelCard'
import { getCountryName } from '../utils/countries'

// Using IPTV-org public API
// Data source: https://github.com/iptv-org/iptv
const IPTV_API_BASE = 'https://iptv-org.github.io/api'

function Home() {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('IN')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [logos, setLogos] = useState({})

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch channels, streams, and logos from IPTV-org API
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

      // Group streams by channel (some channels have multiple streams/feeds)
      const channelStreamsMap = {}
      streamsData.forEach(stream => {
        if (stream.channel) {
          if (!channelStreamsMap[stream.channel]) {
            channelStreamsMap[stream.channel] = []
          }
          channelStreamsMap[stream.channel].push(stream)
        }
      })

      // Create logo lookup map
      const logoMap = {}
      logosData.forEach(logo => {
        const key = logo.feed ? `${logo.channel}::${logo.feed}` : logo.channel
        if (!logoMap[key] && logo.url) {
          logoMap[key] = logo.url
        }
      })

      // Filter out closed channels and merge with streams
      const validChannels = []
      
      channelsData
        .filter(channel => !channel.closed && channel.id)
        .forEach(channel => {
          const streams = channelStreamsMap[channel.id] || []
          
          if (streams.length === 0) return
          
          const bestStream = streams.reduce((best, current) => {
            if (!best) return current
            if (current.quality && !best.quality) return current
            return best
          }, streams[0])
          
          validChannels.push({
            id: channel.id,
            name: channel.name,
            alt_names: channel.alt_names || [],
            network: channel.network,
            country: channel.country,
            categories: channel.categories || [],
            category: channel.categories?.[0] || 'general',
            is_nsfw: channel.is_nsfw,
            website: channel.website,
            stream_url: bestStream.url,
            stream_title: bestStream.title || null,
            stream_quality: bestStream.quality || null,
            referrer: bestStream.referrer || null,
            user_agent: bestStream.user_agent || null,
            feed: bestStream.feed || null
          })
        })

      setChannels(validChannels)
      setLogos(logoMap)
      setLoading(false)
      
      if (import.meta.env.DEV) {
        console.log(`Loaded ${validChannels.length} channels`)
      }
    } catch (err) {
      console.error('Error fetching data from IPTV-org:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  // Memoize filtered channels for better performance
  const filteredChannels = useMemo(() => {
    let filtered = channels

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(channel => {
        const countryName = getCountryName(channel.country)?.toLowerCase() || ''
        return (
          channel.name.toLowerCase().includes(query) ||
          channel.network?.toLowerCase().includes(query) ||
          channel.country?.toLowerCase().includes(query) ||
          countryName.includes(query)
        )
      })
    }

    if (selectedCountry) {
      filtered = filtered.filter(channel => channel.country === selectedCountry)
    }

    if (selectedCategory) {
      filtered = filtered.filter(channel =>
        channel.categories?.includes(selectedCategory)
      )
    }

    return filtered
  }, [channels, searchQuery, selectedCountry, selectedCategory])

  const getLogoUrl = (channel) => {
    if (!channel.id) return null
    
    if (channel.feed) {
      const feedKey = `${channel.id}::${channel.feed}`
      if (logos[feedKey]) return logos[feedKey]
    }
    
    return logos[channel.id] || null
  }

  const uniqueCountries = useMemo(() => {
    const countryCodes = new Set(channels.map(c => c.country).filter(Boolean))
    return Array.from(countryCodes)
      .map(code => ({ code, name: getCountryName(code) }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [channels])

  const uniqueCategories = useMemo(() => {
    const categories = new Set()
    channels.forEach(c => {
      if (c.categories) {
        c.categories.forEach(cat => categories.add(cat))
      }
    })
    return Array.from(categories).sort()
  }, [channels])

  const handleChannelClick = (channel) => {
    window.location.href = `/channel/${channel.id}`
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCountry('IN')
    setSelectedCategory('')
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
            <h2>Loading Channels</h2>
            <p>Preparing your streaming experience...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error | FluxCast</title>
        </Helmet>
        <div className="error-screen">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Unable to Load Channels</h2>
            <p className="error-message">{error}</p>
            <button className="btn-primary" onClick={fetchAllData}>Try Again</button>
            <div className="error-details">
              <p>Unable to connect to IPTV-org API</p>
              <code>{IPTV_API_BASE}</code>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>FluxCast - Modern Live Channel Directory</title>
        <meta name="description" content="Browse and stream free live TV channels from around the world. Clean, modern interface for discovering publicly available streaming content." />
        <meta name="keywords" content="live tv, free streaming, iptv channels, live channels, streaming directory, watch tv online" />
        <link rel="canonical" href="https://streaming.abhiyanpa.in/" />
        
        <meta property="og:title" content="FluxCast - Modern Live Channel Directory" />
        <meta property="og:description" content="Browse and stream free live TV channels from around the world with a clean, Apple TV-inspired interface." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://streaming.abhiyanpa.in/" />
        <meta property="og:image" content="https://streaming.abhiyanpa.in/icons/og-image.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FluxCast - Modern Live Channel Directory" />
        <meta name="twitter:description" content="Browse and stream free live TV channels from around the world." />
        <meta name="twitter:image" content="https://streaming.abhiyanpa.in/icons/og-image.png" />
      </Helmet>

      <div className="search-section">
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search for channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-bar">
          <select
            className="filter-pill"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {uniqueCountries.map(({ code, name }) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>

          <select
            className="filter-pill"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {(searchQuery || selectedCountry !== 'IN' || selectedCategory) && (
            <button className="btn-clear" onClick={clearFilters}>
              Clear All
            </button>
          )}

          <div className="results-count">
            {filteredChannels.length} channel{filteredChannels.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <main className="content-main">
        {filteredChannels.length === 0 && channels.length > 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h2>No Channels Found</h2>
            <p>Try adjusting your search or filters</p>
            <button className="btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : filteredChannels.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">📺</div>
            <h2>No Channels Available</h2>
            <p>Unable to load channels at this time</p>
            <button className="btn-primary" onClick={fetchAllData}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="channel-grid">
            {filteredChannels.map(channel => (
              <ChannelCard 
                key={channel.id} 
                channel={channel} 
                onPlay={handleChannelClick}
                logoUrl={getLogoUrl(channel)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default Home
