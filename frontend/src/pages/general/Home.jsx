import React, { useState, useRef, useEffect } from 'react'
import '../../styles/home.css'
import axios from 'axios'
import { Navigate, Link, useNavigate } from 'react-router-dom'


const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef(null)
  const isScrolling = useRef(false)
  const videoRefs = useRef([])
  const containerRef = useRef(null)
  const [videos, setVideos] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3000/api/food", { withCredentials: true })
      .then(res => {
        setVideos(res.data.foodItems)
      })
      .catch(err => console.log(err));
  },[])

  // Add non-passive wheel listener using useEffect
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      e.preventDefault()

      if (isScrolling.current) return

      const direction = e.deltaY > 0 ? 1 : -1
      let newIndex = activeIndex + direction

      // Clamp the index
      if (!videos || videos.length === 0) return

      newIndex = Math.max(0, Math.min(newIndex, videos.length - 1))

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)
        isScrolling.current = true
        setTimeout(() => {
          isScrolling.current = false
        }, 600)
      }
    }

    // Add listener with passive: false
    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [activeIndex, videos.length])

  

  // Scroll to active video and control playback
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollTop = activeIndex * window.innerHeight
      scrollContainerRef.current.style.transform = `translateY(-${scrollTop}px)`
    }

    // Play active video, pause others
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex) {
          video.play().catch(err => console.log('Autoplay prevented:', err))
        } else {
          video.pause()
        }
      }
    })
  }, [activeIndex])

  // Handle touch swipe
  const touchStartY = useRef(0)

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY

    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1
      let newIndex = activeIndex + direction

      newIndex = Math.max(0, Math.min(newIndex, videos.length - 1))

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)
      }
    }
  }

  return (
    <div 
      ref={containerRef}
      className="home-reels-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="reels-scroll-container" ref={scrollContainerRef}>
        {videos.map((video, index) => (
          <div key={video._id} className="reel-slide">
            {/* Header Bar with Logo and Restaurant Name */}
            <div className="reel-header-bar">
              <img 
                src="https://via.placeholder.com/50?text=Logo"
                alt="Logo"
                className="reel-header-logo"
              />
              <h2 className="reel-header-title">{video.name}</h2>
            </div>

            <video
              ref={el => videoRefs.current[index] = el}
              src={video.video}
              className="reel-media"
              loop
              muted
              playsInline
              preload="metadata"
            />
            
            {/* Overlay with description and button */}
            <div className="reel-overlay">
              <div className="reel-info">
                <p className="reel-description">{video.description}</p>
                {/* <a href={video.storePath} className="reel-button">
                  Visit Store
                </a> */}
                <Link to={`/food-partner/${video.foodPartner.toString()}`} className="reel-button">
                  Visit Store
                </Link>
              </div>
            </div>

            {/* Restaurant name */}
            <div className="reel-restaurant-name">
              <p>{video.restaurantName}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="reel-indicators">
        {videos.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Home