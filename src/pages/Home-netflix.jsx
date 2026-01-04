import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { Play, ChevronLeft, ChevronRight, TrendingUp, Sparkles, Clock, Star } from 'lucide-react'

const IPTV_API_BASE = 'https://iptv-org.github.io/api'

function Home() {
  const navigate = useNavigate()
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('IN')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [logos, setLogos] = useState({})
  const [featuredChannel, setFeaturedChannel] = useState(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
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

      const channelStreamsMap = {}
      streamsData.forEach(stream => {
        if (stream.channel) {
          if (!channelStreamsMap[stream.channel]) {
            channelStreamsMap[stream.channel] = []
          }
          channelStreamsMap[stream.channel].push(stream)
        }
      })

      const logoMap = {}
      logosData.forEach(logo => {
        const key = logo.feed ? `${logo.channel}::${logo.feed}` : logo.channel
        if (!logoMap[key] && logo.url) {
          logoMap[key] = logo.url
        }
      })

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
            network: channel.network,
            country: channel.country,
            categories: channel.categories || [],
            category: channel.categories?.[0] || 'general',
            stream_url: bestStream.url,
            stream_quality: bestStream.quality || null,
            feed: bestStream.feed || null
          })
        })

      setChannels(validChannels)
      setLogos(logoMap)
      
      // Set featured channel (first one with logo preferably)
      const channelWithLogo = validChannels.find(ch => getLogoUrl(ch, logoMap))
      setFeaturedChannel(channelWithLogo || validChannels[0])
      
      setLoading(false)
      console.log(`Loaded ${validChannels.length} channels`)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const getLogoUrl = (channel, logoMapToUse = logos) => {
    if (!channel?.id) return null
    if (channel.feed) {
      const feedKey = `${channel.id}::${channel.feed}`
      if (logoMapToUse[feedKey]) return logoMapToUse[feedKey]
    }
    return logoMapToUse[channel.id] || null
  }

  const filterChannels = (channelList, filters = {}) => {
    let filtered = [...channelList]
    
    if (filters.country) {
      filtered = filtered.filter(ch => ch.country === filters.country)
    }
    
    if (filters.category) {
      filtered = filtered.filter(ch => ch.categories?.includes(filters.category))
    }
    
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(ch =>
        ch.name.toLowerCase().includes(query) ||
        ch.network?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }

  const getChannelsByCountry = (country) => {
    return channels.filter(ch => ch.country === country).slice(0, 20)
  }

  const getChannelsByCategory = (category) => {
    return channels.filter(ch => ch.categories?.includes(category)).slice(0, 20)
  }

  const getTrendingChannels = () => {
    return channels.filter(ch => ch.stream_quality).slice(0, 20)
  }

  const handleChannelClick = (channel) => {
    navigate(`/channel/${channel.id}`)
  }

  const getFilteredChannels = () => {
    return filterChannels(channels, {
      country: selectedCountry,
      category: selectedCategory,
      search: searchQuery
    })
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2>Loading Channels</h2>
          <p>Discovering live streams...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Channels</h2>
          <p className="error-message">{error}</p>
          <button className="btn-primary" onClick={fetchAllData}>Try Again</button>
        </div>
      </div>
    )
  }

  const filteredResults = getFilteredChannels()
  const showFiltered = searchQuery || selectedCountry || selectedCategory

  return (
    <>
      <Helmet>
        <title>FluxCast - Live TV Channels</title>
      </Helmet>

      {/* Hero Section */}
      {featuredChannel && !showFiltered && (
        <HeroSection 
          channel={featuredChannel}
          logo={getLogoUrl(featuredChannel)}
          onPlayClick={() => handleChannelClick(featuredChannel)}
        />
      )}

      {/* Search & Filters */}
      <div className="search-section">
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search channels..."
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
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>

          <select
            className="filter-pill"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="news">News</option>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            <option value="music">Music</option>
            <option value="kids">Kids</option>
          </select>

          {(searchQuery || selectedCountry || selectedCategory) && (
            <button 
              className="btn-clear"
              onClick={() => {
                setSearchQuery('')
                setSelectedCountry('')
                setSelectedCategory('')
              }}
            >
              Clear All
            </button>
          )}

          <div className="results-count">
            {filteredResults.length} channel{filteredResults.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-main">
        {showFiltered ? (
          // Show filtered results
          filteredResults.length > 0 ? (
            <ChannelRow 
              title="Search Results"
              channels={filteredResults}
              onChannelClick={handleChannelClick}
              getLogoUrl={getLogoUrl}
            />
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No Channels Found</h2>
              <p>Try adjusting your filters</p>
            </div>
          )
        ) : (
          // Show curated sections
          <>
            <ChannelRow 
              title="Trending Now"
              icon={<TrendingUp size={24} />}
              channels={getTrendingChannels()}
              onChannelClick={handleChannelClick}
              getLogoUrl={getLogoUrl}
            />
            
            <ChannelRow 
              title="Indian Channels"
              channels={getChannelsByCountry('IN')}
              onChannelClick={handleChannelClick}
              getLogoUrl={getLogoUrl}
            />
            
            <ChannelRow 
              title="News Channels"
              channels={getChannelsByCategory('news')}
              onChannelClick={handleChannelClick}
              getLogoUrl={getLogoUrl}
            />
            
            <ChannelRow 
              title="Sports"
              channels={getChannelsByCategory('sports')}
              onChannelClick={handleChannelClick}
              getLogoUrl={getLogoUrl}
            />
            
            <ChannelRow 
              title="Music & Entertainment"
              channels={getChannelsByCategory('music')}
              onChannelClick={handleChannelClick}
              getLogoUrl={getLogoUrl}
            />
          </>
        )}
      </div>
    </>
  )
}

// Hero Section Component
function HeroSection({ channel, logo, onPlayClick }) {
  return (
    <div className="hero-section">
      <div className="hero-bg">
        {logo && (
          <img src={logo} alt={channel.name} className="hero-bg-image" />
        )}
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>Featured Channel</span>
        </div>
        
        {logo ? (
          <img src={logo} alt={channel.name} className="hero-logo" />
        ) : (
          <h1 className="hero-title">{channel.name}</h1>
        )}
        
        <div className="hero-meta">
          <span className="hero-country">{channel.country}</span>
          <span className="hero-dot">•</span>
          <span className="hero-category">{channel.category}</span>
          {channel.stream_quality && (
            <>
              <span className="hero-dot">•</span>
              <span className="hero-quality">{channel.stream_quality}</span>
            </>
          )}
        </div>
        
        <p className="hero-description">
          {channel.network || 'Watch live streaming content'}
        </p>
        
        <div className="hero-actions">
          <button className="btn-play" onClick={onPlayClick}>
            <Play size={24} fill="currentColor" />
            <span>Watch Live</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Channel Row Component
function ChannelRow({ title, icon, channels, onChannelClick, getLogoUrl }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction) => {
    const container = scrollRef.current
    const scrollAmount = 800
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount
    } else {
      container.scrollLeft += scrollAmount
    }
  }

  const handleScroll = () => {
    const container = scrollRef.current
    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      handleScroll()
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [channels])

  if (!channels || channels.length === 0) return null

  return (
    <div className="channel-row">
      <div className="row-header">
        {icon && <span className="row-icon">{icon}</span>}
        <h2 className="row-title">{title}</h2>
      </div>
      
      <div className="row-container">
        {canScrollLeft && (
          <button className="row-arrow row-arrow-left" onClick={() => scroll('left')}>
            <ChevronLeft size={32} />
          </button>
        )}
        
        <div className="row-scroll" ref={scrollRef}>
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              logo={getLogoUrl(channel)}
              onClick={() => onChannelClick(channel)}
            />
          ))}
        </div>
        
        {canScrollRight && (
          <button className="row-arrow row-arrow-right" onClick={() => scroll('right')}>
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </div>
  )
}

// Channel Card Component
function ChannelCard({ channel, logo, onClick }) {
  const [imageError, setImageError] = useState(false)
  const hasLogo = logo && !imageError

  const getGradient = (name) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return gradients[Math.abs(hash) % gradients.length]
  }

  return (
    <div className="row-card" onClick={onClick}>
      <div 
        className="row-card-inner"
        style={{ background: hasLogo ? 'var(--bg-secondary)' : getGradient(channel.name) }}
      >
        {hasLogo ? (
          <img 
            src={logo}
            alt={channel.name}
            className="row-card-logo"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="row-card-fallback">
            <h3>{channel.name}</h3>
          </div>
        )}
        
        <div className="row-card-overlay">
          <div className="card-play-btn">
            <Play size={32} fill="currentColor" />
          </div>
          <div className="card-info">
            <h3 className="card-name">{channel.name}</h3>
            <div className="card-meta">
              <span>{channel.country}</span>
              {channel.category && (
                <>
                  <span>•</span>
                  <span>{channel.category}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
