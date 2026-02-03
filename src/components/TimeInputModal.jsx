import { useState, useEffect, useRef } from 'react'
import { getTimezoneDisplayName } from '../utils/timeZoneNames'
import './TimeInputModal.css'

function TimeInputModal({ timeZone, currentTime, onConfirm, onClose }) {
  const [timeInput, setTimeInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    // Pre-fill with current time in 12-hour format
    if (currentTime) {
      // Parse current time (e.g., "3:45 PM")
      const match = currentTime.match(/(\d+):(\d+)\s*(AM|PM)/)
      if (match) {
        setTimeInput(currentTime)
      } else {
        setTimeInput('')
      }
    }
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [currentTime])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (timeInput.trim()) {
      onConfirm(timeInput.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content time-input-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>ENTER TIME</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="time-input-info">
          <p>Enter time for <strong>{getTimezoneDisplayName(timeZone)}</strong></p>
          <p className="time-input-hint">Format: 3:45 PM or 15:45</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="time-input-field"
            placeholder="3:45 PM"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="time-input-actions">
            <button type="button" className="time-input-cancel" onClick={onClose}>
              CANCEL
            </button>
            <button type="submit" className="time-input-submit">
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TimeInputModal
