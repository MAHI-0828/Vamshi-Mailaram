import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { MediaItem } from '../types';
import MediaRenderer from './MediaRenderer';

interface CarouselProps {
  media: MediaItem[];
  timelineId?: string;
}

interface CarouselSlideItemProps {
  item: MediaItem;
  itemsToShow: number;
  index: number;
  onHoverStart: (index: number) => void;
  onHoverEnd: (index: number) => void;
  timelineId?: string;
}

const CarouselSlideItem: React.FC<CarouselSlideItemProps> = React.memo(({
  item,
  itemsToShow,
  index,
  onHoverStart,
  onHoverEnd,
  timelineId
}) => {
  const isReelsTimeline = timelineId === 'event-upgraded-iphone-reels';
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);
  const itemRef = useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = useCallback(() => {
    if (isReelsTimeline) return;
    isHoveredRef.current = true;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (isHoveredRef.current) {
        onHoverStart(index);
      }
    }, 1500);
  }, [index, isReelsTimeline, onHoverStart]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (isReelsTimeline) return;
    
    // Get the related target (element mouse moved to)
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    // Only close if we're not moving to a child element of the thumbnail
    if (itemRef.current && !itemRef.current.contains(relatedTarget)) {
      isHoveredRef.current = false;
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      onHoverEnd(index);
    }
  }, [index, isReelsTimeline, onHoverEnd]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      isHoveredRef.current = false;
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative flex-shrink-0 ${!isReelsTimeline ? 'cursor-pointer' : ''}`}
      style={{ width: `calc(100% / ${itemsToShow})`, height: '100%' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="group"
      aria-roledescription="slide"
      data-index={index}
    >
      <div className="flex items-center justify-center p-0.5 sm:p-1 rounded-md transition-transform duration-300 ease-in-out hover:scale-105 h-full">
        <MediaRenderer
          mediaItem={item}
          className="max-w-full max-h-full object-contain rounded-md"
        />
      </div>
    </div>
  );
});

const Carousel: React.FC<CarouselProps> = React.memo(({ media, timelineId }) => {
  const [itemsToShow, setItemsToShow] = useState(3);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const modalRoot = document.getElementById('modal-root');

  const onHoverStart = useCallback((index: number) => {
    setHoveredIndex(index);
    setIsScrollLocked(true);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  }, []);

  const onHoverEnd = useCallback((index: number) => {
    setHoveredIndex(null);
    setIsScrollLocked(false);
    setIsDragging(false);
    if (!isTimelineHovered) {
      resetAutoScroll();
    }
  }, [isTimelineHovered]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isScrollLocked) return;
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(currentIndex);
  }, [isScrollLocked, currentIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isScrollLocked) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) / (containerRef.current?.offsetWidth || 1) * 0.5;
    const newIndex = Math.max(0, Math.min(scrollLeft - Math.round(walk * itemsToShow), media.length - itemsToShow));
    setCurrentIndex(newIndex);
  }, [isDragging, isScrollLocked, startX, scrollLeft, itemsToShow, media.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const autoScroll = useCallback(() => {
    if (isScrollLocked || isDragging || isTimelineHovered) return;
    
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, media.length - itemsToShow);
      const next = prev + 1;
      if (next > maxIndex) {
        setTimeout(() => {
          setCurrentIndex(0);
        }, 500);
        return prev;
      }
      return next;
    });
  }, [media.length, itemsToShow, isScrollLocked, isDragging, isTimelineHovered]);

  const resetAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    if (!isScrollLocked && !isDragging && !isTimelineHovered) {
      autoScrollRef.current = setInterval(autoScroll, 3000);
    }
  }, [autoScroll, isScrollLocked, isDragging, isTimelineHovered]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isScrollLocked) return;
    e.preventDefault();

    if (scrollTimeoutRef.current) {
      return;
    }

    const delta = Math.sign(e.deltaX || e.deltaY);
    const newIndex = currentIndex + delta;
    
    if (newIndex >= 0 && newIndex <= media.length - itemsToShow) {
      setCurrentIndex(newIndex);
      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null;
      }, 150);
    }
  }, [currentIndex, itemsToShow, media.length, isScrollLocked]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleWheel]);

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [resetAutoScroll]);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    
    updateItemsToShow();
    const debouncedResize = debounce(updateItemsToShow, 250);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  const renderCarouselContent = useCallback(() => {
    return (
      <div
        ref={containerRef}
        className={`flex transition-transform duration-500 ease-in-out h-full ${
          isScrollLocked ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{
          transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsTimelineHovered(true)}
        onMouseOut={() => {
          setIsTimelineHovered(false);
          if (!isScrollLocked && !isDragging) {
            resetAutoScroll();
          }
        }}
      >
        {media.map((item, index) => (
          <CarouselSlideItem
            key={`${item.src}-${index}`}
            item={item}
            itemsToShow={itemsToShow}
            index={index}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            timelineId={timelineId}
          />
        ))}
      </div>
    );
  }, [
    currentIndex,
    itemsToShow,
    isScrollLocked,
    media,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    onHoverStart,
    onHoverEnd,
    timelineId,
    resetAutoScroll,
    isDragging
  ]);

  const modalContent = useMemo(() => {
    if (!hoveredIndex || !modalRoot || timelineId === 'event-upgraded-iphone-reels') return null;
    
    // Calculate safe margins for the modal
    const calculateModalDimensions = () => {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const safeMargin = 32; // 2rem margin on all sides
      
      const maxHeight = windowHeight - (headerHeight + safeMargin * 2);
      const maxWidth = windowWidth - (safeMargin * 2);
      
      return {
        maxHeight: `${maxHeight}px`,
        maxWidth: `${maxWidth}px`,
        top: `${headerHeight + safeMargin}px`
      };
    };

    const modalDimensions = calculateModalDimensions();
    
    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center p-8 modal-preview pointer-events-none"
        style={{
          paddingTop: modalDimensions.top
        }}
      >
        <div
          className="relative bg-transparent rounded-lg overflow-hidden group pointer-events-none"
          style={{
            maxHeight: modalDimensions.maxHeight,
            maxWidth: modalDimensions.maxWidth
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <MediaRenderer
              mediaItem={media[hoveredIndex]}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
          {media[hoveredIndex].description && (
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-['Roboto Mono']">{media[hoveredIndex].description}</p>
            </div>
          )}
        </div>
      </div>,
      modalRoot
    );
  }, [hoveredIndex, media, modalRoot, timelineId, onHoverEnd]);

  return (
    <>
      {modalContent}
      <div className="relative overflow-hidden h-[300px] sm:h-[400px]">
        {renderCarouselContent()}
        {isScrollLocked && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            Scroll or drag to navigate
          </div>
        )}
      </div>
    </>
  );
});

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

export default Carousel;
