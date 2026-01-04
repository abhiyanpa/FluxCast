import { useState } from 'react'

function ChannelCard({ channel, onPlay, logoUrl }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Determine if we should show logo or gradient
  const hasValidLogo = logoUrl && !imageError

  // Generate gradient based on channel name (consistent color per channel)
  const getGradient = (name) => {
    if (!name) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
      'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      'linear-gradient(135deg, #f8b500 0%, #fceabb 100%)',
    ]
    
    // Simple hash function to pick gradient consistently
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return gradients[Math.abs(hash) % gradients.length]
  }

  return (
    <div className="channel-card" onClick={() => onPlay(channel)}>
      <div 
        className="channel-card-inner" 
        style={{ background: hasValidLogo ? 'var(--bg-card)' : getGradient(channel.name) }}
      >
        {hasValidLogo ? (
          <>
            <div className="channel-logo-container">
              <img 
                src={logoUrl}
                alt={channel.name}
                className="channel-logo"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true)
                  console.warn(`Failed to load logo for ${channel.name}`)
                }}
                style={{ opacity: imageLoaded ? 1 : 0 }}
              />
            </div>
            <div className="channel-content">
              <h3 className="channel-name">
                {channel.name}
              </h3>
              {channel.country && channel.category && (
                <div className="channel-meta">
                  <span className="channel-country">{channel.country}</span>
                  <span className="channel-dot">•</span>
                  <span className="channel-category">{channel.category}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="channel-content gradient-mode">
            <h3 className="channel-name" style={{ color: '#fff' }}>
              {channel.name}
            </h3>
            {channel.country && channel.category && (
              <div className="channel-meta" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <span className="channel-country">{channel.country}</span>
                <span className="channel-dot">•</span>
                <span className="channel-category">{channel.category}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChannelCard
