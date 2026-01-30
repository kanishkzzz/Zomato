import React, { useState, useRef, useEffect } from 'react'
import '../../styles/home.css'

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef(null)
  const isScrolling = useRef(false)
  const videoRefs = useRef([])
  const containerRef = useRef(null)

  // Sample video data
  const videos = [
    {
      id: 1,
      videoUrl: 'https://ik.imagekit.io/t5mdehnzi/790d4744-1d85-4349-9161-eb4ebac55a8d_xz0YMC4ob',
      description: 'Amazing pizza from our store - Fresh ingredients and delicious taste!',
      restaurantName: 'Pizza Paradise',
      storePath: '/store/1'
    },
    {
      id: 2,
      videoUrl: 'https://ik.imagekit.io/t5mdehnzi/f239965d-b1e0-4cdf-8563-3b76521454f5_3kPJrVerk',
      description: 'Fresh sushi rolls prepared by our expert chefs',
      restaurantName: 'Sushi World',
      storePath: '/store/2'
    },
    {
      id: 3,
      videoUrl: 'https://ik.imagekit.io/t5mdehnzi/ff40f5c2-0d61-4f3b-978a-5a33624f9d44_erpb5M304',
      description: 'Delicious biryani with aromatic spices and tender meat',
      restaurantName: 'Biryani House',
      storePath: '/store/3'
    },
    {
      id: 4,
      videoUrl: 'https://ik.imagekit.io/t5mdehnzi/6c6a5234-fe92-449f-83fb-73983d41dcaf_wXqhok9L2',
      description: 'Burgers that taste amazing and are made with premium ingredients',
      restaurantName: 'Burger Station',
      storePath: '/store/4'
    }
  ]

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
          <div key={video.id} className="reel-slide">
            {/* Header Bar with Logo and Restaurant Name */}
            <div className="reel-header-bar">
              <img 
                src="https://via.placeholder.com/50?text=Logo"
                alt="Logo"
                className="reel-header-logo"
              />
              <h2 className="reel-header-title">{video.restaurantName}</h2>
            </div>

            <video
              ref={el => videoRefs.current[index] = el}
              src={video.videoUrl}
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
                <a href={video.storePath} className="reel-button">
                  Visit Store
                </a>
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