import { useState, useMemo, useEffect, useRef } from 'react'
import { X, Search } from 'lucide-react'
import { getTimezoneShorthand, getTimezoneDisplayName } from '../utils/timeZoneNames'
import './Modal.css'
import './TimeZoneModal.css'

// Common time zones list
const TIME_ZONES = [
  // North America
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/San_Francisco',
  'America/Seattle',
  'America/Portland',
  'America/Phoenix',
  'America/Anchorage',
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  // South America
  'America/Sao_Paulo',
  'America/Rio_de_Janeiro',
  'America/Buenos_Aires',
  'America/Argentina/Buenos_Aires',
  'America/Bogota',
  'America/Caracas',
  'America/Lima',
  'America/Santiago',
  'America/Montevideo',
  'America/La_Paz',
  'America/Asuncion',
  'America/Guayaquil',
  'America/Georgetown',
  'America/Paramaribo',
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
  'Asia/Bangalore',
  'Asia/Chennai',
  'Asia/Hyderabad',
  'Asia/Yangon',
  'Asia/Phnom_Penh',
  'Asia/Vientiane',
  'Asia/Brunei',
  'Asia/Dili',
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
  const modalRef = useRef(null)
  const searchInputRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previousActiveElement = useRef(null)

  const filteredTimeZones = useMemo(() => {
    if (!searchTerm) return TIME_ZONES
    
    const term = searchTerm.toLowerCase()
    return TIME_ZONES.filter(tz => {
      const displayName = getTimezoneDisplayName(tz).toLowerCase()
      const shorthand = getTimezoneShorthand(tz).toLowerCase()
      return displayName.includes(term) || tz.toLowerCase().includes(term) || shorthand.includes(term)
    })
  }, [searchTerm])

  useEffect(() => {
    // Store the previously focused element
    previousActiveElement.current = document.activeElement

    // Focus search input when modal opens
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    // Trap focus within modal
    const handleTab = (e) => {
      if (!modalRef.current) return

      const focusableElements = modalRef.current.querySelectorAll(
        'button:not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleTab)

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTab)
      document.body.style.overflow = ''
      // Restore focus to previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [onClose])

  const formatTimeZoneName = (tz) => {
    return getTimezoneDisplayName(tz)
  }

  const handleSelect = (tz) => {
    if (!existingTimeZones.includes(tz)) {
      onSelect(tz)
    }
  }

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="timezone-modal-title"
    >
      <div 
        className="modal-content timezone-modal" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close timezone selection modal"
          ref={closeButtonRef}
        >
          <X size={24} aria-hidden="true" />
        </button>
        <div className="modal-header">
          <h2 className="modal-title" id="timezone-modal-title">Select Time Zone</h2>
        </div>
        <div className="modal-body timezone-modal-body">
          <div className="timezone-search-wrapper">
            <label htmlFor="timezone-search-input" className="sr-only">Search time zones</label>
            <div className="timezone-search-container">
              <Search className="timezone-search-icon" size={18} aria-hidden="true" />
              <input
                id="timezone-search-input"
                type="text"
                className="timezone-search"
                placeholder="Search time zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchInputRef}
                aria-label="Search time zones"
              />
              {searchTerm && (
                <button
                  className="timezone-search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  type="button"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <div className="timezone-list-wrapper">
            {filteredTimeZones.length === 0 ? (
              <div className="timezone-empty-state">
                <p>No time zones found</p>
                <p className="timezone-empty-hint">Try a different search term</p>
              </div>
            ) : (
              <div className="timezone-list" role="listbox" aria-label="Time zone options">
                {filteredTimeZones.map(tz => {
                  const isSelected = existingTimeZones.includes(tz)
                  return (
                    <button
                      key={tz}
                      className={`timezone-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(tz)}
                      disabled={isSelected}
                      role="option"
                      aria-selected={isSelected}
                      aria-label={`${formatTimeZoneName(tz)} ${isSelected ? 'already added' : ''}`}
                    >
                      <div className="timezone-item-content">
                        <span className="timezone-shorthand">{getTimezoneShorthand(tz)}</span>
                        <span className="timezone-full">{formatTimeZoneName(tz)}</span>
                      </div>
                      {isSelected && (
                        <span className="selected-badge" aria-label="Already added">
                          ADDED
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeZoneModal
