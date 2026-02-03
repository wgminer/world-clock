import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import './Modal.css'
import './AboutModal.css'

function AboutModal({ onClose }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previousActiveElement = useRef(null)

  useEffect(() => {
    // Store the previously focused element
    previousActiveElement.current = document.activeElement

    // Focus the close button when modal opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
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
  }, [onClose])

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button 
          className="modal-close" 
          onClick={onClose} 
          aria-label="Close about modal"
          ref={closeButtonRef}
        >
          <X size={24} aria-hidden="true" />
        </button>
        <div className="modal-header">
          <h2 className="modal-title" id="about-modal-title">About</h2>
        </div>
        <div className="modal-body about-modal-content">
          <p>World Clock is a simple, elegant way to view the time across multiple time zones.</p>
          <p>Click on any clock to edit the time and see how it affects all other clocks in real-time.</p>
          <p>Add clocks using the + button, and share your configuration with others.</p>
        </div>
      </div>
    </div>
  )
}

export default AboutModal
