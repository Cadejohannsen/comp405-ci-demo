"use client";

import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  videoSrc?: string;
  opacity?: number;
  children: React.ReactNode;
}

export default function VideoBackground({ 
  videoSrc = "/videos/car-showcase.mp4", 
  opacity = 0.3,
  children 
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.8; // Slow down slightly for better effect
      video.volume = 0; // Muted for background
      video.loop = true;
      video.muted = true;
      video.playsInline = true;

      const handleCanPlay = () => {
        setIsLoaded(true);
        video.play().catch(err => {
          console.log("Video autoplay failed:", err);
        });
      };

      const handleError = () => {
        console.log("Video failed to load:", videoSrc);
        setHasError(true);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      // Try to play immediately
      video.play().catch(err => {
        console.log("Initial video play failed:", err);
      });

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoSrc]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {!hasError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ opacity: isLoaded ? opacity : 0 }}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
            {/* Fallback for browsers that don't support the video format */}
            Your browser does not support the video tag.
          </video>
        ) : (
          /* Fallback gradient background */
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        )}
        
        {/* Dark overlay for better text visibility */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: 0.1 }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
