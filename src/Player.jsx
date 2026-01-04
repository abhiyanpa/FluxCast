import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

function Player({ channel, onClose }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [qualities, setQualities] = useState([])
  const [currentQuality, setCurrentQuality] = useState(-1)
  const controlsTimeoutRef = useRef(null)

  useEffect(() => {
    if (!channel.stream_url) {
      setError('Stream URL not available')
      setLoading(false)
      return
    }

    const video = videoRef.current
    if (!video) return

    // Check if stream is HLS
    const isHLS = channel.stream_url.includes('.m3u8')

    if (isHLS) {
      // Try native HLS first (Safari)
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (import.meta.env.DEV) {
          console.log('Using native HLS support')
        }
        video.src = channel.stream_url
        video.addEventListener('loadedmetadata', () => setLoading(false))
        video.addEventListener('error', handleVideoError)
      } 
      // Use HLS.js for other browsers
      else if (Hls.isSupported()) {
        if (import.meta.env.DEV) {
          console.log('Using HLS.js')
          console.log('Stream URL:', channel.stream_url)
          if (channel.referrer) console.log('Referrer:', channel.referrer)
          if (channel.user_agent) console.log('User-Agent:', channel.user_agent)
        }
        
        const hlsConfig = {
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
          xhrSetup: function(xhr, url) {
            // Note: Browser security prevents setting Referer and User-Agent headers
            // These logs help debug which headers the stream expects
            if (channel.referrer && import.meta.env.DEV) {
              console.log('Stream requires Referer:', channel.referrer)
            }
          }
        }
        
        const hls = new Hls(hlsConfig)
        
        hlsRef.current = hls
        hls.loadSource(channel.stream_url)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (import.meta.env.DEV) {
            console.log('HLS manifest parsed')
          }
          
          // Get available quality levels
          if (hls.levels && hls.levels.length > 0) {
            const levels = hls.levels.map((level, index) => ({
              index,
              height: level.height,
              bitrate: level.bitrate,
              label: level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)}kbps`
            }))
            setQualities(levels)
            setCurrentQuality(hls.currentLevel)
          }
          
          setLoading(false)
          video.play().catch(err => {
            console.error('Auto-play failed:', err)
            setIsPlaying(false)
          })
        })

        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          setCurrentQuality(data.level)
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data)
          if (data.fatal) {
            setLoading(false)
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError('Network error - cannot load stream')
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError('Media error - trying to recover...')
                hls.recoverMediaError()
                break
              default:
                setError('Fatal error - cannot play stream')
                hls.destroy()
                break
            }
          }
        })
      } else {
        setError('HLS not supported in this browser')
        setLoading(false)
      }
    } else {
      // Direct stream (non-HLS)
      if (import.meta.env.DEV) {
        console.log('Using direct stream')
      }
      video.src = channel.stream_url
      video.addEventListener('loadedmetadata', () => setLoading(false))
      video.addEventListener('error', handleVideoError)
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      if (video) {
        video.removeEventListener('error', handleVideoError)
        video.removeEventListener('loadedmetadata', () => setLoading(false))
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('volumechange', handleVolumeChange)
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [channel.stream_url])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return

      switch(e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlayPause()
          break
        case 'f':
          e.preventDefault()
          handleFullscreen()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'ArrowLeft':
          e.preventDefault()
          seek(-10)
          break
        case 'ArrowRight':
          e.preventDefault()
          seek(10)
          break
        case 'ArrowUp':
          e.preventDefault()
          changeVolume(0.1)
          break
        case 'ArrowDown':
          e.preventDefault()
          changeVolume(-0.1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying, volume, isMuted])

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video) {
      setCurrentTime(video.currentTime)
    }
  }
  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (video) {
      setDuration(video.duration)
    }
  }
  const handleVolumeChange = () => {
    const video = videoRef.current
    if (video) {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }
  }

  const handleVideoError = (e) => {
    console.error('Video error:', e)
    setError('cors-blocked')
    setLoading(false)
  }

  const handleFullscreen = async () => {
    const video = videoRef.current
    const container = video?.parentElement
    if (!video || !container) return

    try {
      // Check if already in fullscreen
      const isCurrentlyFullscreen = 
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement

      if (!isCurrentlyFullscreen) {
        // For iOS/mobile: use video element's native fullscreen
        if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen() // iOS Safari (video element)
          setIsFullscreen(true)
        } 
        // For desktop: use container fullscreen with all vendor prefixes
        else if (container.requestFullscreen) {
          await container.requestFullscreen()
          setIsFullscreen(true)
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen() // Safari desktop
          setIsFullscreen(true)
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen() // Firefox
          setIsFullscreen(true)
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen() // IE11
          setIsFullscreen(true)
        }
        // Fallback for Android: try video element
        else if (video.requestFullscreen) {
          await video.requestFullscreen()
          setIsFullscreen(true)
        } else if (video.webkitRequestFullscreen) {
          await video.webkitRequestFullscreen()
          setIsFullscreen(true)
        }
      } else {
        // Exit fullscreen - try all vendor prefixes
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen() // Safari
        } else if (document.webkitCancelFullScreen) {
          await document.webkitCancelFullScreen() // iOS Safari
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen() // Firefox
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen() // IE11
        }
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
      // Silent fail - fullscreen may not be supported
    }
  }

  const togglePlayPause = () => {
    const video = videoRef.current
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    video.muted = !video.muted
  }

  const changeVolume = (delta) => {
    const video = videoRef.current
    const newVolume = Math.max(0, Math.min(1, video.volume + delta))
    video.volume = newVolume
  }

  const seek = (seconds) => {
    const video = videoRef.current
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
  }

  const handleProgressClick = (e) => {
    const video = videoRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * video.duration
  }

  const handleQualityChange = (index) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index
      setCurrentQuality(index)
    }
  }

  const enablePictureInPicture = async () => {
    const video = videoRef.current
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await video.requestPictureInPicture()
      }
    } catch (err) {
      console.error('PiP error:', err)
    }
  }

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  return (
    <div className="player-view">
      <div className="player-header">
        <button className="player-back-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Back</span>
        </button>
        
        <div className="player-title">
          <h2>{channel.name}</h2>
          {channel.network && <span className="player-network">{channel.network}</span>}
        </div>
        
        <button className="player-fullscreen-btn" onClick={handleFullscreen}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      </div>

      <div className="player-wrapper">
        <div 
          className="video-container" 
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {loading && (
            <div className="video-loading">
              <div className="spinner-large"></div>
              <p>Loading stream...</p>
            </div>
          )}

          {error && (
            <div className="video-error">
              <div className="error-icon-large">⚠️</div>
              <h3>Stream Blocked by Browser</h3>
              <p className="error-hint">
                This stream cannot be played directly in the browser due to CORS restrictions.
                <br/>Many IPTV streams work only with desktop apps like VLC.
              </p>
              <div className="error-solutions">
                <h4>📺 How to Watch:</h4>
                <ol style={{textAlign: 'left', margin: '1rem auto', maxWidth: '400px'}}>
                  <li><strong>VLC Media Player:</strong> Open VLC → Media → Open Network Stream → Paste URL</li>
                  <li><strong>Copy Stream URL:</strong> Right-click channel → "Copy link"</li>
                  <li><strong>Try Another Channel:</strong> Some channels work directly in browser</li>
                </ol>
              </div>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem'}}>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    navigator.clipboard.writeText(channel.stream_url)
                    alert('Stream URL copied! Paste it in VLC Media Player.')
                  }}
                >
                  📋 Copy URL for VLC
                </button>
                <button className="btn-secondary" onClick={onClose}>Go Back</button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="video-player"
            autoPlay
            playsInline
            onClick={togglePlayPause}
          />

          {/* YouTube-like Custom Controls */}
          <div className={`custom-controls ${showControls ? 'show' : ''}`}>
            {/* Control Buttons */}
            <div className="controls-row">
              <div className="controls-left">
                <button className="control-btn" onClick={togglePlayPause}>
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                <button className="control-btn" onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  )}
                </button>

                <div className="volume-slider">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const video = videoRef.current
                      video.volume = e.target.value
                      video.muted = false
                    }}
                  />
                </div>
              </div>

              <div className="controls-right">
                <button className="control-btn" onClick={enablePictureInPicture} title="Picture in Picture">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/>
                  </svg>
                </button>

                <button className="control-btn" onClick={handleFullscreen}>
                  {isFullscreen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Play/Pause Overlay */}
          {!loading && !error && (
            <div className={`play-pause-overlay ${!isPlaying ? 'show' : ''}`}>
              <div className="play-pause-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" opacity="0.9">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="player-info-panel">
          <div className="info-header">
            <h1 className="channel-title">{channel.name}</h1>
            {channel.network && <p className="channel-network">{channel.network}</p>}
          </div>

          <div className="info-metadata">
            {channel.country && (
              <div className="metadata-item">
                <span className="metadata-label">Country</span>
                <span className="metadata-value">{channel.country}</span>
              </div>
            )}
            {channel.languages && channel.languages.length > 0 && (
              <div className="metadata-item">
                <span className="metadata-label">Language</span>
                <span className="metadata-value">{channel.languages.join(', ')}</span>
              </div>
            )}
            {channel.categories && channel.categories.length > 0 && (
              <div className="metadata-item">
                <span className="metadata-label">Categories</span>
                <span className="metadata-value">{channel.categories.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="info-actions" style={{marginTop: '1.5rem', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            <button 
              className="btn-secondary" 
              onClick={() => {
                navigator.clipboard.writeText(channel.stream_url)
                alert('Stream URL copied! You can paste it in VLC or other media players.')
              }}
              style={{flex: '1', minWidth: '200px'}}
            >
              📋 Copy URL for VLC
            </button>
            {channel.website && (
              <a 
                href={channel.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary"
                style={{flex: '1', minWidth: '200px', textDecoration: 'none', display: 'inline-block', textAlign: 'center'}}
              >
                🌐 Official Website
              </a>
            )}
          </div>

          {!channel.website && (
            <div className="info-hint" style={{marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.9rem'}}>
              💡 <strong>Tip:</strong> If stream doesn't work in browser, copy the URL and open it in VLC Media Player for better compatibility.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Player
