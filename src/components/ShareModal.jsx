import { useState } from 'react'
import { X, Copy, Mail, Check } from 'lucide-react'
import './ShareModal.css'

function ShareModal({ onClose, shareUrl }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent('World Clock')
    const body = encodeURIComponent(`Check out this world clock: ${shareUrl}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="share-modal-close" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>
        <h2 className="share-modal-title">Share World Clock</h2>
        <div className="share-modal-content">
          <div className="share-url-container">
            <input
              type="text"
              className="share-url-input"
              value={shareUrl}
              readOnly
            />
          </div>
          <div className="share-actions">
            <button className="share-action-button" onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check size={20} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={20} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <button className="share-action-button" onClick={handleEmailShare}>
              <Mail size={20} />
              <span>Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareModal
