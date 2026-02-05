import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { getTimezoneDisplayName } from '../utils/timeZoneNames'
import './Modal.css'
import './TimeInputModal.css'

function TimeInputModal({ timeZone, currentTime, onConfirm, onClose }) {
  const [timeInput, setTimeInput] = useState('')
  const inputRef = useRef(null)
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previousActiveElement = useRef(null)

  useEffect(() => {
    // Store the previously focused element
    previousActiveElement.current = document.activeElement

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
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  }, [currentTime, onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (timeInput.trim()) {
      onConfirm(timeInput.trim())
    }
  }

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="time-input-modal-title"
    >
      <div 
        className="modal-content time-input-modal" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close time input modal"
          ref={closeButtonRef}
        >
          <X size={24} aria-hidden="true" />
        </button>
        <div className="modal-header">
          <h2 className="modal-title" id="time-input-modal-title">Enter Time</h2>
        </div>
        <div className="modal-body">
          <div className="time-input-info">
            <p>Enter time for <strong>{getTimezoneDisplayName(timeZone)}</strong></p>
            <p className="time-input-hint">Format: 3:45 PM or 15:45</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="time-input-field" className="sr-only">Time input</label>
            <input
              id="time-input-field"
              ref={inputRef}
              type="text"
              className="time-input-field"
              placeholder="3:45 PM"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value.toUpperCase())}
              aria-label="Enter time"
            />
            <div className="time-input-actions">
              <button 
                type="button" 
                className="time-input-cancel" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="time-input-submit"
                aria-label="Update time"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TimeInputModal
