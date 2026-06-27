import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../../styles/home.css'
import BottomNav from '../../components/BottomNav'
import { getSavedReelIds, storeSavedReelIds } from '../../utils/savedReels'
import CommentsSheet from '../../components/CommentsSheet'

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [videos, setVideos] = useState([])
  const [likedReels, setLikedReels] = useState({})
  const [savedReelIds, setSavedReelIds] = useState(() => getSavedReelIds())
  const [showComments, setShowComments] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [commentsByVideo, setCommentsByVideo] = useState({})

  const scrollContainerRef = useRef(null)
  const containerRef = useRef(null)
  const isScrolling = useRef(false)
  const videoRefs = useRef([])
  const touchStartY = useRef(0)

  useEffect(() => {
    axios.get('http://localhost:4000/api/food', { withCredentials: true })
      .then((res) => {
        const fetchedVideos = res.data.foodItems || []
        setVideos(fetchedVideos)

        const likedState = fetchedVideos.reduce((acc, video) => {
          acc[video._id] = Boolean(video.likedByCurrentUser)
          return acc
        }, {})

        setLikedReels(likedState)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    storeSavedReelIds(savedReelIds)
  }, [savedReelIds])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      if (showComments) return
      e.preventDefault()
      if (isScrolling.current || videos.length === 0) return

      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = Math.max(0, Math.min(activeIndex + direction, videos.length - 1))

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
  }, [activeIndex, videos.length, showComments])

  useEffect(() => {
    if (!scrollContainerRef.current) return

    const viewportHeight = containerRef.current?.clientHeight || window.innerHeight
    scrollContainerRef.current.style.transform = `translateY(-${activeIndex * viewportHeight}px)`

    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === activeIndex) {
        video.play().catch(() => { })
      } else {
        video.pause()
      }
    })
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex > videos.length - 1) {
      setActiveIndex(0)
    }
  }, [videos.length, activeIndex])

  const handleTouchStart = (e) => {
    if (showComments) return
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (showComments) return
    if (videos.length === 0) return

    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY

    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1
      const nextIndex = Math.max(0, Math.min(activeIndex + direction, videos.length - 1))
      setActiveIndex(nextIndex)
    }
  }

  const toggleLike = async (videoId) => {
    try {
      const res = await axios.post('http://localhost:4000/api/food/like', { foodId: videoId }, { withCredentials: true })
      const isLiked = Boolean(res.data?.liked)
      const likeCount = Number(res.data?.likeCount || 0)

      setLikedReels((prev) => ({
        ...prev,
        [videoId]: isLiked
      }))

      setVideos((prev) => prev.map((video) => (
        video._id === videoId
          ? { ...video, likeCount }
          : video
      )))
    } catch (error) {
      console.log(error)
    }
  }

  const toggleSave = (videoId) => {
    setSavedReelIds((prev) => (
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    ))
  }

  const openCommentSheet = (video) => {
    setSelectedVideo(video)
    setShowComments(true)
    loadComments(video._id)
  }
  const closeCommentSheet = () => setShowComments(false)

  const loadComments = async (videoId) => {
    if (!videoId) return
    try {
      const res = await axios.get(`http://localhost:4000/api/food/${videoId}/comments`, { withCredentials: true })
      const normalized = (res.data?.comments || []).map((item) => ({
        id: item._id,
        text: item.comment
      }))

      setCommentsByVideo((prev) => ({
        ...prev,
        [videoId]: normalized
      }))
    } catch (err) {
      console.log(err)
    }
  }

  const addComment = async (videoId, text) => {
    const commentText = text.trim()
    if (!commentText) return
    try {
      await axios.post('http://localhost:4000/api/food/comment', { foodId: videoId, comment: commentText }, { withCredentials: true })
      await loadComments(videoId)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      ref={containerRef}
      className="home-reels-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {videos.length === 0 && (
        <section className="empty-state">
          <h2>No reels yet</h2>
          <p>Food videos will appear here once available.</p>
          <BottomNav />
        </section>
      )}

      <div className="reels-scroll-container" ref={scrollContainerRef}>
        {videos.map((video, index) => {
          const isLiked = Boolean(likedReels[video._id])
          const isSaved = savedReelIds.includes(video._id)
          const commentCount = commentsByVideo[video._id]?.length ?? video.commentCount ?? 0

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
                  <span>{video.likeCount || 0}</span>
                </button>

                <button
                  type="button"
                  className="action-item"
                  aria-label="Comment"
                  onClick={() => openCommentSheet(video)}
                >
                  <i className="ri-chat-1-line action-icon" />
                  <span>{commentCount}</span>
                </button>

                <button
                  type="button"
                  className={`action-item save-btn ${isSaved ? 'saved' : ''}`}
                  aria-label="Save"
                  onClick={() => toggleSave(video._id)}
                >
                  <i className={isSaved ? 'ri-bookmark-fill action-icon' : 'ri-bookmark-line action-icon'} />
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
      <CommentsSheet
        open={showComments}
        onClose={closeCommentSheet}
        video={selectedVideo}
        comments={selectedVideo ? (commentsByVideo[selectedVideo._id] || []) : []}
        onAddComment={addComment}
      />
    </div>
  )
}

export default Home
