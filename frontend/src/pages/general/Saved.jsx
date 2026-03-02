import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../../styles/home.css'
import BottomNav from '../../components/BottomNav'
import { getSavedReelIds, storeSavedReelIds } from '../../utils/savedReels'

const Saved = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [videos, setVideos] = useState([])
  const [likedReels, setLikedReels] = useState({})
  const [savedReelIds, setSavedReelIds] = useState(() => getSavedReelIds())

  const scrollContainerRef = useRef(null)
  const containerRef = useRef(null)
  const isScrolling = useRef(false)
  const videoRefs = useRef([])
  const touchStartY = useRef(0)

  useEffect(() => {
    axios.get('http://localhost:3000/api/food', { withCredentials: true })
      .then((res) => setVideos(res.data.foodItems || []))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    storeSavedReelIds(savedReelIds)
  }, [savedReelIds])

  const savedVideos = useMemo(
    () => videos.filter((video) => savedReelIds.includes(video._id)),
    [videos, savedReelIds]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      e.preventDefault()
      if (isScrolling.current || savedVideos.length === 0) return

      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = Math.max(0, Math.min(activeIndex + direction, savedVideos.length - 1))

      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex)
        isScrolling.current = true
        setTimeout(() => {
          isScrolling.current = false
        }, 450)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [activeIndex, savedVideos.length])

  useEffect(() => {
    if (!scrollContainerRef.current) return

    const viewportHeight = containerRef.current?.clientHeight || window.innerHeight
    scrollContainerRef.current.style.transform = `translateY(-${activeIndex * viewportHeight}px)`

    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === activeIndex) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex > savedVideos.length - 1) {
      setActiveIndex(0)
    }
  }, [savedVideos.length, activeIndex])

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (savedVideos.length === 0) return

    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY

    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1
      const nextIndex = Math.max(0, Math.min(activeIndex + direction, savedVideos.length - 1))
      setActiveIndex(nextIndex)
    }
  }

  const toggleLike = (videoId) => {
    setLikedReels((prev) => ({
      ...prev,
      [videoId]: !prev[videoId]
    }))
  }

  const removeSaved = (videoId) => {
    setSavedReelIds((prev) => prev.filter((id) => id !== videoId))
  }

  return (
    <div
      ref={containerRef}
      className="home-reels-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {savedVideos.length === 0 && (
        <section className="empty-state">
          <h2>No saved reels</h2>
          <p>Tap the bookmark icon on Home to save reels here.</p>
          <BottomNav />
        </section>
      )}

      <div className="reels-scroll-container" ref={scrollContainerRef}>
        {savedVideos.map((video, index) => {
          const isLiked = Boolean(likedReels[video._id])

          return (
            <article key={video._id} className="reel-slide">
              <header className="reel-header-bar">
                <img
                  src="https://via.placeholder.com/80x80?text=logo"
                  alt="Store logo"
                  className="reel-header-logo"
                />
                <div className="reel-header-details">
                  <h2 className="reel-header-title">{video.name}</h2>
                  <p className="reel-header-price">{video.price ? `INR ${video.price}` : 'Price'}</p>
                  <p className="reel-header-store">{video.restaurantName || 'Store Name'}</p>
                </div>
              </header>

              <video
                ref={(el) => {
                  videoRefs.current[index] = el
                }}
                src={video.video}
                className="reel-media"
                loop
                muted
                playsInline
                preload="metadata"
              />

              <div className="reel-actions">
                <button
                  type="button"
                  className={`action-item like-btn ${isLiked ? 'liked' : ''}`}
                  aria-label="Like"
                  onClick={() => toggleLike(video._id)}
                >
                  <i className={isLiked ? 'ri-heart-fill action-icon' : 'ri-heart-line action-icon'} />
                  <span>{video.likesCount || '24.2k'}</span>
                </button>

                <button type="button" className="action-item" aria-label="Comment">
                  <i className="ri-chat-1-line action-icon" />
                  <span>{video.commentCount || '1.9k'}</span>
                </button>

                <button
                  type="button"
                  className="action-item save-btn saved"
                  aria-label="Unsave"
                  onClick={() => removeSaved(video._id)}
                >
                  <i className="ri-bookmark-fill action-icon" />
                </button>
              </div>

              <div className="reel-overlay">
                <div className="reel-info">
                  <p className="reel-description">{video.description || 'Description'}</p>
                  <Link to={`/food-partner/${video.foodPartner}`} className="reel-button">
                    Visit Store
                  </Link>
                </div>
              </div>

              <BottomNav />
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default Saved
