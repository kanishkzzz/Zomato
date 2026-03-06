import React, { useEffect, useState } from 'react'
import '../styles/commentsheet.css'

export default function CommentsSheet({ open, onClose, video, comments = [], onAddComment }) {
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!open) setDraft('')
  }, [open, video?._id])

  if (!video) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    onAddComment?.(video._id, draft)
    setDraft('')
  }

  return (
    <div className={`sheet-wrapper ${open ? 'open' : ''}`}>
      <div className="sheet-backdrop" onClick={onClose}></div>

      <div
        className="sheet-container"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="sheet-header">
          <div className="sheet-drag"></div>
          <h3>Comments</h3>
        </div>

        <div className="sheet-content">
          {comments.length === 0 ? (
            <p className="sheet-empty">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="sheet-comment-item">
                {comment.text}
              </div>
            ))
          )}
        </div>

        <form className="sheet-input-row" onSubmit={handleSubmit}>
          <input
            type="text"
            className="sheet-input"
            placeholder="Add a comment..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="sheet-send-btn">Post</button>
        </form>
      </div>
    </div>
  )
}
