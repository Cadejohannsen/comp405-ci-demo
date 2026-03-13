"use client";

import { useState } from "react";

interface YouTubeBackgroundProps {
  videoId: string;
  opacity?: number;
  children: React.ReactNode;
}

export default function YouTubeBackground({ 
  videoId, 
  opacity = 0.3,
  children 
}: YouTubeBackgroundProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* YouTube Video Embed */}
      <div className="absolute inset-0 z-0">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&rel=0`}
          style={{ opacity }}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        
        {/* Dark overlay for better text visibility */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: 0.6 }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Play button for user interaction (required by browsers) */}
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 cursor-pointer"
          style={{ opacity: isPlaying ? 0 : 1 }}
        >
          <div className="text-white text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-lg font-medium">Click to Play Background Video</p>
            <p className="text-sm opacity-75 mt-2">Due to browser policies, video requires user interaction</p>
          </div>
        </button>
      )}
    </div>
  );
}
