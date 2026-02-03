import { useState, useMemo } from 'react'
import { getTimezoneShorthand, getTimezoneDisplayName } from '../utils/timeZoneNames'
import './TimeZoneModal.css'

// Common time zones list
const TIME_ZONES = [
  // North America
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/San_Francisco',
  'America/Phoenix',
  'America/Anchorage',
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  // South America
  'America/Sao_Paulo',
  'America/Buenos_Aires',
  'America/Argentina/Buenos_Aires',
  'America/Bogota',
  'America/Caracas',
  'America/Lima',
  'America/Santiago',
  // Europe
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Europe/Moscow',
  'Europe/Athens',
  'Europe/Dublin',
  'Europe/Lisbon',
  'Europe/Prague',
  'Europe/Warsaw',
  'Europe/Zurich',
  'Atlantic/Reykjavik',
  // Middle East
  'Asia/Dubai',
  'Asia/Tel_Aviv',
  'Asia/Riyadh',
  'Asia/Kuwait',
  'Asia/Baghdad',
  // Asia - Major Cities
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Bangkok',
  'Asia/Kuala_Lumpur',
  'Asia/Jakarta',
  'Asia/Manila',
  'Asia/Taipei',
  'Asia/Kolkata',
  'Asia/Karachi',
  'Asia/Dhaka',
  'Asia/Ho_Chi_Minh',
  'Asia/Delhi',
  'Asia/Mumbai',
  'Asia/Hanoi',
  // Australia & Pacific
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Brisbane',
  'Australia/Perth',
  'Australia/Adelaide',
  'Australia/Darwin',
  'Australia/Hobart',
  'Pacific/Auckland',
  'Pacific/Honolulu',
  'Pacific/Fiji',
  // Africa
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Casablanca',
]

function TimeZoneModal({ existingTimeZones, onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTimeZones = useMemo(() => {
    if (!searchTerm) return TIME_ZONES
    
    const term = searchTerm.toLowerCase()
    return TIME_ZONES.filter(tz => {
      const displayName = getTimezoneDisplayName(tz).toLowerCase()
      const shorthand = getTimezoneShorthand(tz).toLowerCase()
      return displayName.includes(term) || tz.toLowerCase().includes(term) || shorthand.includes(term)
    })
  }, [searchTerm])

  const formatTimeZoneName = (tz) => {
    return getTimezoneDisplayName(tz)
  }

  const handleSelect = (tz) => {
    if (!existingTimeZones.includes(tz)) {
      onSelect(tz)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>SELECT TIME ZONE</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <input
          type="text"
          className="timezone-search"
          placeholder="SEARCH..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        <div className="timezone-list">
          {filteredTimeZones.map(tz => {
            const isSelected = existingTimeZones.includes(tz)
            return (
              <button
                key={tz}
                className={`timezone-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(tz)}
                disabled={isSelected}
              >
                <span className="timezone-shorthand">{getTimezoneShorthand(tz)}</span>
                <span className="timezone-full">{formatTimeZoneName(tz)}</span>
                {isSelected && <span className="selected-badge">ADDED</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TimeZoneModal
