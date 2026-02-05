import { useState, useEffect } from 'react'
import ClockGrid from './components/ClockGrid'
import TimeZoneModal from './components/TimeZoneModal'
import ShareModal from './components/ShareModal'
import AboutModal from './components/AboutModal'
import { getTimezoneShorthand, decodeTimezoneFromShorthand } from './utils/timeZoneNames'
import './App.css'

function App() {
  const [timeZones, setTimeZones] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

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
    if (zones.length > 0) {
      // Convert full timezone names to abbreviations for URL
      const abbreviations = zones.map(tz => getTimezoneShorthand(tz))
      // Manually construct query string to avoid URLSearchParams encoding + as %2B
      const newURL = `${window.location.pathname}?zones=${abbreviations.join('+')}`
      window.history.pushState({}, '', newURL)
    } else {
      window.history.pushState({}, '', window.location.pathname)
    }
  }

  // Parse time zones from URL (decode abbreviations to full timezone names)
  useEffect(() => {
    const searchParams = window.location.search
    // Handle both URL-encoded (%2B) and literal (+) plus signs, and old comma format
    const zonesMatch = searchParams.match(/[?&]zones=([^&]*)/)
    const zonesParam = zonesMatch ? decodeURIComponent(zonesMatch[1]) : null
    
    if (zonesParam) {
      // Check if using old comma-separated format
      const isOldFormat = zonesParam.includes(',') && !zonesParam.includes('+')
      
      // Decode abbreviations from URL to full timezone names
      // Support both comma (old) and plus (new) separators
      const separator = isOldFormat ? ',' : '+'
      const abbreviations = zonesParam.split(separator).filter(Boolean)
      const zones = abbreviations.map(abbr => decodeTimezoneFromShorthand(abbr))
      const orderedZones = ensureUserTimeZoneFirst(zones)
      setTimeZones(orderedZones)
      
      // If old format detected or order changed, redirect to new format
      if (isOldFormat || orderedZones.join(',') !== zones.join(',')) {
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
    if (timeZones.length > 0) {
      const abbreviations = timeZones.map(tz => getTimezoneShorthand(tz))
      // Manually construct query string to avoid URLSearchParams encoding + as %2B
      return `${window.location.origin}${window.location.pathname}?zones=${abbreviations.join('+')}`
    }
    return `${window.location.origin}${window.location.pathname}`
  }

  const handleShareClick = () => {
    setIsShareModalOpen(true)
  }

  const handleAboutClick = () => {
    setIsAboutModalOpen(true)
  }

  return (
    <div className="app">
      <ClockGrid 
        timeZones={timeZones}
        onAddClick={() => setIsModalOpen(true)}
        onDelete={handleDeleteTimeZone}
        onShareClick={handleShareClick}
        onAboutClick={handleAboutClick}
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
      {isAboutModalOpen && (
        <AboutModal
          onClose={() => setIsAboutModalOpen(false)}
        />
      )}
    </div>
  )
}

export default App
