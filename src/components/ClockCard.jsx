import { useState, useRef, useEffect } from 'react'
import './ClockCard.css'
import { getTimezoneDisplayName } from '../utils/timeZoneNames'

function ClockCard({ timeZone, time, dateOffset, hour, isUserTimeZone, onDelete, onTimeChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(time)
  const inputRef = useRef(null)
  const displayName = getTimezoneDisplayName(timeZone)
  
  // Get date indicator text
  const getDateIndicator = () => {
    if (dateOffset === 1) return 'TOMORROW'
    if (dateOffset === -1) return 'YESTERDAY'
    return null
  }

  // Get background color based on time of day
  const getTimeOfDayColor = () => {
    if (hour === undefined || hour === null) return '#1a237e' // Night
    if (hour >= 5 && hour < 12) return '#ffeb3b' // Morning (yellow)
    if (hour >= 12 && hour < 17) return '#ff9800' // Afternoon (orange)
    if (hour >= 17 && hour < 21) return '#ff5722' // Evening (red-orange)
    return '#1a237e' // Night (dark blue)
  }

  // Get text color based on background color (for contrast)
  const getTextColorForBackground = (bgColor) => {
    // Morning and Afternoon use dark text, Evening and Night use light text
    if (hour === undefined || hour === null) return '#ffffff'
    if (hour >= 5 && hour < 17) return '#000000' // Morning/Afternoon: dark text
    return '#ffffff' // Evening/Night: light text
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
    if (e.target.closest('.delete-button') || e.target.closest('.user-badge') || e.target.closest('.date-badge')) {
      return
    }
    setIsEditing(true)
    setEditValue(time)
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setEditValue(newValue)
    // Update other clocks in real-time as user types
    onTimeChange(newValue)
  }

  const handleInputBlur = () => {
    setIsEditing(false)
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

  const dateIndicator = getDateIndicator()
  const bgColor = getTimeOfDayColor()
  const txtColor = getTextColorForBackground(bgColor)

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
        <span className="user-badge">
          <span className="user-badge-dot"></span>
          YOU
        </span>
      )}
      {dateIndicator && (
        <span className="date-badge">{dateIndicator}</span>
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
                color: txtColor
              }}
            />
          ) : (
            <div className="time-display" onClick={handleTimeClick}>{time}</div>
          )}
        </div>
        <div className="location-display">{displayName}</div>
      </div>
    </div>
  )
}

export default ClockCard
