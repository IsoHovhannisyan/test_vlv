'use client';

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Autoplay, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cube';

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const swiperRef = useRef<any>(null);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [autoAdvanceInterval, setAutoAdvanceInterval] = useState<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const videoStories = [
    {
      id: 1,
      video: "https://vlv.am/public/uploads/video_stories/175267690017264886181725019727IMG_1349%20(1).mov",
      thumbnail: "https://picsum.photos/90/90?random=1",
      text: "Սպիտակեղենի նոր տեսականի",
      alt: "Bed with white linens and painting"
    },
    {
      id: 2,
      video: "https://vlv.am/public/uploads/video_stories/1748509752IMG_7587.MOV",
      thumbnail: "https://picsum.photos/90/90?random=2",
      text: "Ամառանոցային կահույք",
      alt: "Woman in white polo shirt with red logo"
    },
    {
      id: 3,
      video: "https://vlv.am/public/uploads/video_stories/1747379923IMG_7957.MOV",
      thumbnail: "https://picsum.photos/90/90?random=3",
      text: "Օդորակիչներ",
      alt: "Man in light blue checkered shirt with wall units"
    },
    {
      id: 4,
      video: "https://vlv.am/public/uploads/video_stories/1746110187IMG_7658.MOV",
      thumbnail: "https://picsum.photos/90/90?random=4",
      text: "Խորոված պատրաստող սարքեր",
      alt: "Man sitting outdoors with sunglasses"
    },
    {
      id: 5,
      video: "https://vlv.am/public/uploads/video_stories/1741697936NB_PRO900_10_OPT1_9X16_MUTED_MIN_TEXTLESS.mp4",
      thumbnail: "https://picsum.photos/90/90?random=5",
      text: "Բլենդերներ",
      alt: "Black blender with fruit smoothie"
    },
    {
      id: 6,
      video: "https://vlv.am/public/uploads/video_stories/1736762605IMG_5319.MOV",
      thumbnail: "https://picsum.photos/90/90?random=6",
      text: "Դռներ",
      alt: "White door with silver handle"
    }
  ];

  const handleVideoClick = (index: number) => {
    setCurrentVideoIndex(index);
    setShowVideoPlayer(true);
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    // Auto-advance to next video
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrevious = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleClose = () => {
    setShowVideoPlayer(false);
    setIsPlaying(false);
    // Clear auto-advance interval
    if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
      setAutoAdvanceInterval(null);
    }
  };

  // Enhanced touch gesture handlers for Instagram Reels-style navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsHolding(false);
    
    // Start hold timer for forward movement
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true);
      handleNext();
    }, 500); // 500ms hold to move forward
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    // Cancel hold if user starts swiping
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    // Cancel hold timer
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setIsHolding(false);
  };

  // Mouse events for click and hold functionality
  const handleMouseDown = () => {
    setIsHolding(false);
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true);
      handleNext();
    }, 500);
  };

  const handleMouseUp = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setIsHolding(false);
  };

  const handleMouseLeave = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setIsHolding(false);
  };

  // Auto-advance functionality
  useEffect(() => {
    if (showVideoPlayer && isPlaying) {
      // Auto-advance only when video ends, not on timer
      // Removed the 5-second interval
    }
  }, [showVideoPlayer, isPlaying]);

  // Handle swiper slide change
  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setCurrentVideoIndex(newIndex);
    
    // Pause all videos
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        video.pause();
        // Mute all videos except the current one
        video.muted = idx !== newIndex || isMuted;
      }
    });
    
    // Play the current video
    const currentVideo = videoRefs.current[newIndex];
    if (currentVideo) {
      currentVideo.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 safe-area-inset">
      <div className="max-w-7xl mx-auto">
        {/* REELS Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 tracking-wide">
          REELS
        </h1>
        
        {/* Video Stories Container */}
        <div className="flex gap-4 md:gap-8 pb-4 overflow-x-auto scrollbar-hide">
          {videoStories.map((story, index) => (
            <div 
              key={story.id}
              className="flex-shrink-0 cursor-pointer transition-all duration-300 touch-manipulation"
              style={{
                width: '114px',
                height: '159px',
                marginRight: '30px'
              }}
              onClick={() => handleVideoClick(index)}
            >
              {/* Thumbnail Container */}
              <div 
                className="rounded-full overflow-hidden bg-gray-100 mb-3 transition-all duration-300 border-2 border-transparent hover:border-red-500"
                style={{
                  width: '114px',
                  height: '114px',
                  padding: '9px'
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={story.thumbnail}
                    alt={story.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Text */}
              <p className="text-sm text-center leading-tight font-medium transition-colors duration-300 text-gray-800 hover:text-red-500">
                {story.text}
              </p>
            </div>
          ))}
        </div>

        {/* Video Player Modal with Swiper.js */}
        {showVideoPlayer && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
            <div 
              className="relative w-full h-full video-player-mobile video-player-desktop overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                className="absolute top-6 right-6 w-[37px] h-[37px] bg-transparent hover:bg-white rounded-full flex items-center justify-center text-white hover:text-red-500 text-2xl z-50 transition-all duration-200 touch-manipulation"
              >
                ✕
              </button>
              
              {/* Swiper Video Container */}
              <div className="relative bg-black w-full h-full md:rounded-lg md:overflow-hidden overflow-hidden">
                <Swiper
                  ref={swiperRef}
                  direction="vertical"
                  effect="slide"
                  grabCursor={true}
                  keyboard={{ enabled: true }}
                  mousewheel={false}
                  allowTouchMove={true}
                  modules={[Keyboard]}
                  onSlideChange={handleSlideChange}
                  initialSlide={currentVideoIndex}
                  className="w-full h-full overflow-hidden"
                >
                  {videoStories.map((story, index) => (
                    <SwiperSlide key={story.id} className="StoryContentParent">
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        className="StoryVideoImageContent w-full h-full object-cover"
                        src={story.video}
                        playsInline
                        crossOrigin="anonymous"
                        autoPlay={index === currentVideoIndex}
                        preload="auto"
                        muted={index !== currentVideoIndex || isMuted}
                        onEnded={handleVideoEnd}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      
                      {/* Hold indicator */}
                      {isHolding && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white text-2xl font-bold">⏭️</div>
                        </div>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Video Player Controls - Outside Swiper */}
                <div className="absolute bottom-8 right-6 flex flex-col items-center gap-6 z-50 pointer-events-auto">
                  {/* Like Button */}
                  <button 
                    className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-80 active:bg-opacity-90 transition-all duration-200 touch-manipulation"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Like functionality here
                      console.log('Like button clicked!');
                    }}
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                  </button>

                  {/* Play Button */}
                  <button 
                    className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-80 active:bg-opacity-90 transition-all duration-200 touch-manipulation"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Play button clicked!');
                      const currentVideo = videoRefs.current[currentVideoIndex];
                      if (currentVideo) {
                        if (currentVideo.paused) {
                          currentVideo.play();
                        } else {
                          currentVideo.pause();
                        }
                      }
                    }}
                  >
                    {isPlaying ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  {/* Volume Button */}
                  <button 
                    className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-80 active:bg-opacity-90 transition-all duration-200 touch-manipulation"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Volume button clicked!');
                      setIsMuted(!isMuted);
                      // Mute/unmute all videos
                      videoRefs.current.forEach((video, idx) => {
                        if (video) {
                          video.muted = idx !== currentVideoIndex || !isMuted;
                        }
                      });
                    }}
                  >
                    {isMuted ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.25-2.5-4v8c1.48-.75 2.5-2.23 2.5-4zM5 9v6h4l5 5V4L9 9H5z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Navigation instructions */}
              <div className="text-center mt-4 text-white text-sm">
                <p className="mt-2 text-gray-300">{currentVideoIndex + 1} / {videoStories.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
