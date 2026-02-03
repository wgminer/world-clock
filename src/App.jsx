import { useState, useEffect } from 'react'
import ClockGrid from './components/ClockGrid'
import TimeZoneModal from './components/TimeZoneModal'
import ShareModal from './components/ShareModal'
import { getTimezoneShorthand, decodeTimezoneFromShorthand } from './utils/timeZoneNames'
import './App.css'

function App() {
  const [timeZones, setTimeZones] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  // Get user's time zone
  const getUserTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  // Ensure user's time zone is always first
  const ensureUserTimeZoneFirst = (zones) => {
    const userTz = getUserTimeZone()
    const filtered = zones.filter(tz => tz !== userTz)
    return [userTz, ...filtered]
  }

  // Update URL when time zones change (use abbreviations in URL)
  const updateURL = (zones) => {
    const params = new URLSearchParams()
    if (zones.length > 0) {
      // Convert full timezone names to abbreviations for URL
      const abbreviations = zones.map(tz => getTimezoneShorthand(tz))
      params.set('zones', abbreviations.join(','))
    }
    const newURL = `${window.location.pathname}${zones.length > 0 ? '?' + params.toString() : ''}`
    window.history.pushState({}, '', newURL)
  }

  // Parse time zones from URL (decode abbreviations to full timezone names)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const zonesParam = params.get('zones')
    
    if (zonesParam) {
      // Decode abbreviations from URL to full timezone names
      const abbreviations = zonesParam.split(',').filter(Boolean)
      const zones = abbreviations.map(abbr => decodeTimezoneFromShorthand(abbr))
      const orderedZones = ensureUserTimeZoneFirst(zones)
      setTimeZones(orderedZones)
      // Update URL if order changed (will re-encode to abbreviations)
      if (orderedZones.join(',') !== zones.join(',')) {
        updateURL(orderedZones)
      }
    } else {
      // Default to user's time zone
      const userTz = getUserTimeZone()
      setTimeZones([userTz])
      updateURL([userTz])
    }
  }, [])

  const handleAddTimeZone = (timeZone) => {
    if (!timeZones.includes(timeZone)) {
      const newTimeZones = ensureUserTimeZoneFirst([...timeZones, timeZone])
      setTimeZones(newTimeZones)
      updateURL(newTimeZones)
    }
    setIsModalOpen(false)
  }

  const handleDeleteTimeZone = (timeZone) => {
    const userTz = getUserTimeZone()
    // Don't allow deleting user's time zone if it's the only one
    if (timeZone === userTz && timeZones.length === 1) {
      return
    }
    
    const newTimeZones = ensureUserTimeZoneFirst(
      timeZones.filter(tz => tz !== timeZone)
    )
    
    setTimeZones(newTimeZones)
    updateURL(newTimeZones)
  }

  const getShareUrl = () => {
    const params = new URLSearchParams()
    if (timeZones.length > 0) {
      const abbreviations = timeZones.map(tz => getTimezoneShorthand(tz))
      params.set('zones', abbreviations.join(','))
    }
    return `${window.location.origin}${window.location.pathname}${timeZones.length > 0 ? '?' + params.toString() : ''}`
  }

  const handleShareClick = () => {
    setIsShareModalOpen(true)
  }

  const handleSaveClick = () => {
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'World Clock',
        text: 'Check out this world clock',
        url: getShareUrl()
      }).catch(err => {
        console.log('Error sharing:', err)
      })
    } else {
      // Fallback: try to trigger bookmark (browser-dependent)
      // Most browsers don't allow programmatic bookmarking, so we'll just copy the URL
      const url = getShareUrl()
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard! You can bookmark this page.')
      }).catch(err => {
        console.log('Error copying:', err)
        // Last resort: show the URL
        alert(`Share this URL: ${url}`)
      })
    }
  }

  return (
    <div className="app">
      <ClockGrid 
        timeZones={timeZones}
        onAddClick={() => setIsModalOpen(true)}
        onDelete={handleDeleteTimeZone}
        onShareClick={handleShareClick}
        onSaveClick={handleSaveClick}
      />
      {isModalOpen && (
        <TimeZoneModal
          existingTimeZones={timeZones}
          onSelect={handleAddTimeZone}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isShareModalOpen && (
        <ShareModal
          onClose={() => setIsShareModalOpen(false)}
          shareUrl={getShareUrl()}
        />
      )}
    </div>
  )
}

export default App
