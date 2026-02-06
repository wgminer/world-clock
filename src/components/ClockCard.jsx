import { useState, useRef, useEffect } from 'react'
import './ClockCard.css'
import { getTimezoneDisplayName } from '../utils/timeZoneNames'

function ClockCard({ timeZone, time, dateOffset, hour, isUserTimeZone, onDelete, onTimeChange, onEditingChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(time)
  const inputRef = useRef(null)
  const displayName = getTimezoneDisplayName(timeZone)
  
  // 24-hour color lookup table
  const HOUR_COLORS = [
    '#1a237e', // 0 - Midnight (dark blue)
    '#1a237e', // 1 - Early night
    '#1a237e', // 2 - Deep night
    '#1a237e', // 3 - Late night
    '#283593', // 4 - Pre-dawn
    '#3949ab', // 5 - Dawn
    '#5c6bc0', // 6 - Early morning
    '#7986cb', // 7 - Morning
    '#9fa8da', // 8 - Late morning
    '#c5cae9', // 9 - Mid-morning
    '#e8eaf6', // 10 - Late morning
    '#fff9c4', // 11 - Pre-noon
    '#ffeb3b', // 12 - Noon (yellow)
    '#fff176', // 13 - Early afternoon
    '#ffd54f', // 14 - Afternoon
    '#ffc107', // 15 - Mid-afternoon
    '#ffb300', // 16 - Late afternoon
    '#ff9800', // 17 - Early evening (orange)
    '#ff6f00', // 18 - Evening
    '#ff5722', // 19 - Late evening (red-orange)
    '#e64a19', // 20 - Dusk
    '#bf360c', // 21 - Night
    '#8d1f0f', // 22 - Deep night
    '#1a237e', // 23 - Midnight (dark blue)
  ]

  // Get background color based on time of day
  const getTimeOfDayColor = () => {
    if (hour === undefined || hour === null) return HOUR_COLORS[0]
    const hourIndex = Math.floor(hour) % 24
    return HOUR_COLORS[hourIndex]
  }

  // Get text color based on background color (for contrast)
  const getTextColorForBackground = (bgColor) => {
    if (hour === undefined || hour === null) return '#ffffff'
    
    // Parse hex color
    const hex = bgColor.replace('#', '')
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      
      // Calculate brightness (using relative luminance formula)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      
      // If brightness is high, use dark text; otherwise use light text
      return brightness > 128 ? '#000000' : '#ffffff'
    }
    
    // Fallback
    return '#ffffff'
  }

  // Get font weight based on text color
  const getFontWeight = (textColor) => {
    // If text is light (white or similar), reduce weight by 100
    if (textColor === '#ffffff' || textColor.toLowerCase().includes('fff')) {
      return 200 // Reduced from 300
    }
    return 300
  }

  // Sync editValue when time prop changes (but only if not editing)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(time)
    }
  }, [time, isEditing])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleTimeClick = (e) => {
    // Don't trigger if clicking on delete button or other elements
    if (e.target.closest('.delete-button')) {
      return
    }
    setIsEditing(true)
    setEditValue(time)
    if (onEditingChange) onEditingChange(true)
  }

  const handleInputChange = (e) => {
    // Force uppercase conversion
    const newValue = e.target.value.toUpperCase()
    setEditValue(newValue)
    // Update other clocks in real-time as user types
    onTimeChange(newValue)
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    if (onEditingChange) onEditingChange(false)
    // If invalid or empty, reset everything
    if (!editValue.trim() || !isValidTime(editValue.trim())) {
      onTimeChange('') // Signal to reset
      setEditValue(time)
    }
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      setEditValue(time)
      setIsEditing(false)
      if (onEditingChange) onEditingChange(false)
      onTimeChange('') // Reset
    }
  }

  // Validate time format
  const isValidTime = (timeStr) => {
    if (!timeStr) return false
    // Try 12-hour format (e.g., "3:45 PM")
    const match12 = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (match12) {
      const hours = parseInt(match12[1])
      const minutes = parseInt(match12[2])
      return hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59
    }
    // Try 24-hour format (e.g., "15:45")
    const match24 = timeStr.match(/(\d+):(\d+)/)
    if (match24) {
      const hours = parseInt(match24[1])
      const minutes = parseInt(match24[2])
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
    }
    return false
  }

  const bgColor = getTimeOfDayColor()
  const txtColor = getTextColorForBackground(bgColor)
  const fontWeight = getFontWeight(txtColor)

  return (
    <div 
      className="clock-card"
      style={{ 
        backgroundColor: bgColor,
        color: txtColor
      }}
    >
      {onDelete && (
        <button className="delete-button" onClick={onDelete} aria-label="Delete clock">
          REMOVE
        </button>
      )}
      {isUserTimeZone && (
        <div className="you-are-here-indicator">
          YOU ARE HERE
        </div>
      )}
      <div className="clock-card-content">
        <div className="time-display-wrapper">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="time-input-inline"
              value={editValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              style={{
                backgroundColor: bgColor,
                color: txtColor,
                fontWeight: fontWeight
              }}
            />
          ) : (
            <div 
              className="time-display" 
              onClick={handleTimeClick}
              style={{ fontWeight: fontWeight }}
            >
              {time}
            </div>
          )}
        </div>
        <div className="location-display-wrapper">
          <div className="location-display">{displayName}</div>
        </div>
      </div>
    </div>
  )
}

export default ClockCard
