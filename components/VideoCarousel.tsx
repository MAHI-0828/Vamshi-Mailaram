import React, { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '../types';

interface VideoCarouselProps {
  media: MediaItem[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoCount = media.length;

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videoCount);
    }, 5000); // Change video every 5 seconds

    return () => clearInterval(interval);
  }, [videoCount]);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoCount);
  }, [videoCount]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videoCount) % videoCount);
  }, [videoCount]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main carousel container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Previous videos */}
        <div className="absolute left-0 w-1/3 h-full flex items-center justify-end opacity-40 transform -translate-x-1/6 scale-85 transition-all duration-500 cursor-pointer hover:opacity-60 hover:scale-90"
             onClick={goToPrev}>
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            {media[(currentIndex - 1 + videoCount) % videoCount] && (
              <iframe
                src={`${media[(currentIndex - 1 + videoCount) % videoCount].src}?autoplay=0&controls=0&showinfo=0&rel=0`}
                title="Previous video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                frameBorder="0"
              />
            )}
          </div>
        </div>

        {/* Current video (center) */}
        <div className="relative w-2/3 aspect-video z-10 transform scale-100 transition-all duration-500 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl">
          {media[currentIndex] && (
            <iframe
              src={`${media[currentIndex].src}?autoplay=1&controls=1&showinfo=1&rel=0`}
              title="Current video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              frameBorder="0"
              allowFullScreen
            />
          )}
          {media[currentIndex]?.description && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm">
              <p className="text-sm text-gray-800 font-['Roboto Mono']">{media[currentIndex].description}</p>
            </div>
          )}
        </div>

        {/* Next videos */}
        <div className="absolute right-0 w-1/3 h-full flex items-center justify-start opacity-40 transform translate-x-1/6 scale-85 transition-all duration-500 cursor-pointer hover:opacity-60 hover:scale-90"
             onClick={goToNext}>
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            {media[(currentIndex + 1) % videoCount] && (
              <iframe
                src={`${media[(currentIndex + 1) % videoCount].src}?autoplay=0&controls=0&showinfo=0&rel=0`}
                title="Next video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                frameBorder="0"
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full z-20 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        ←
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full z-20 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        →
      </button>

      {/* Video indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {media.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gray-800 scale-125' 
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel; 