import React, { useState, useEffect } from 'react';
import { MediaItem, MediaType, BeforeAfterMediaItem } from '../types';

interface MediaRendererProps {
  mediaItem: MediaItem;
  className?: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = React.memo(({ mediaItem, className = "" }) => {
  const [showAfter, setShowAfter] = useState(false);

  // Set up automatic transition for BeforeAfter type
  useEffect(() => {
    if (mediaItem.type === MediaType.BeforeAfter) {
      const interval = setInterval(() => {
        setShowAfter(prev => !prev);
      }, 2000); // Switch every 2 seconds

      return () => clearInterval(interval);
    }
  }, [mediaItem.type]);

  switch (mediaItem.type) {
    case MediaType.Image:
      return (
        <img
          src={mediaItem.src}
          alt={mediaItem.altText || 'Portfolio image'}
          className={`w-full h-full object-cover ${className}`}
          loading="lazy"
        />
      );

    case MediaType.YouTubeVideo:
      // Ensure YouTube URLs are in embed format
      const embedUrl = mediaItem.src.includes('embed') 
        ? mediaItem.src 
        : mediaItem.src.replace('watch?v=', 'embed/');
      return (
        <iframe
          src={embedUrl}
          title={mediaItem.altText || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className={`w-full h-full ${className}`}
        ></iframe>
      );

    case MediaType.InstagramReel:
      return (
        <div className="w-full h-full p-2 sm:p-2">
          <div className="relative w-full h-full overflow-hidden rounded-md">
            <iframe
              src={`${mediaItem.src}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&background=1&quality=1080p`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                transform: 'translate(-50%, -50%) scale(1.5)',
                border: 'none',
                objectFit: 'cover'
              }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={mediaItem.altText || "Vimeo video player"}
            />
          </div>
        </div>
      );

    case MediaType.GenericVideo:
      return (
        <video
          src={mediaItem.src}
          controls
          preload="metadata"
          playsInline
          className={`w-full h-full object-cover ${className}`}
          onError={(e) => {
            console.error('Video failed to load:', mediaItem.src, e);
          }}
        >
          <source src={mediaItem.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );

    case MediaType.BeforeAfter:
      const beforeAfterItem = mediaItem as BeforeAfterMediaItem;
      return (
        <div className="relative w-full h-full group">
          {/* After image */}
          <img
            src={beforeAfterItem.afterSrc}
            alt={`${beforeAfterItem.altText || 'After'} - After`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              showAfter ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            loading="lazy"
          />
          {/* Before image (base layer) */}
          <img
            src={beforeAfterItem.beforeSrc}
            alt={`${beforeAfterItem.altText || 'Before'} - Before`}
            className={`w-full h-full object-cover ${className}`}
            loading="lazy"
          />
          {/* Overlay text */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
            {showAfter ? 'After' : 'Before'}
          </div>
        </div>
      );

    default:
      return <p className="text-slate-400 p-4">Unsupported media type</p>;
  }
});

export default MediaRenderer;
