import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { MediaItem, MediaType } from '../types';
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
  modalContainerRef: React.RefObject<HTMLDivElement | null>;
}

const CarouselSlideItem: React.FC<CarouselSlideItemProps> = React.memo(({
  item,
  itemsToShow,
  index,
  onHoverStart,
  onHoverEnd,
  timelineId,
  modalContainerRef
}) => {
  const isReelsTimeline = timelineId === 'event-upgraded-iphone-reels';
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const [cursorPointer, setCursorPointer] = useState(false);

  const clearAllTimeouts = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (cursorTimeoutRef.current) {
      clearTimeout(cursorTimeoutRef.current);
      cursorTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = useCallback(() => {
    if (isReelsTimeline) return;
    isHoveredRef.current = true;

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    cursorTimeoutRef.current = setTimeout(() => {
      setCursorPointer(true);
    }, 200);

    hoverTimeoutRef.current = setTimeout(() => {
      if (isHoveredRef.current) {
        onHoverStart(index);
      }
    }, 1500);
  }, [index, isReelsTimeline, onHoverStart]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (isReelsTimeline) return;
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    isHoveredRef.current = false;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (cursorTimeoutRef.current) {
      clearTimeout(cursorTimeoutRef.current);
      cursorTimeoutRef.current = null;
    }
    setCursorPointer(false);

    if (!modalContainerRef.current?.contains(relatedTarget)) {
      onHoverEnd(index);
    }
  }, [index, isReelsTimeline, onHoverEnd, modalContainerRef]);

  const handleClick = useCallback(() => {
    if (isReelsTimeline) return;
    clearAllTimeouts();
    onHoverStart(index);
  }, [index, isReelsTimeline, onHoverStart]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      setCursorPointer(false);
      isHoveredRef.current = false;
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative flex-shrink-0 ${!isReelsTimeline && cursorPointer ? 'cursor-pointer' : ''}`}
      style={{ width: `calc(100% / ${itemsToShow})`, height: '100%' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="group"
      aria-roledescription="slide"
      data-index={index}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          clearAllTimeouts();
          onHoverStart(index);
        }
      }}
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
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const modalRoot = document.getElementById('modal-root');
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const onHoverStart = useCallback((index: number) => {
    if (isDragging) return;
    setHoveredIndex(index);
    setIsScrollLocked(true);
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  }, [isDragging]);

  const onHoverEnd = useCallback((index: number) => {
    setHoveredIndex(current => (current === index ? null : current));
    setIsScrollLocked(false);
    setIsDragging(false);
    if (!isTimelineHovered) resetAutoScroll();
  }, [isTimelineHovered]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setIsScrollLocked(true);
    startXRef.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeftRef.current = currentIndex;
    if (hoveredIndex !== null) setHoveredIndex(null);
  }, [currentIndex, hoveredIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startXRef.current) / (containerRef.current?.offsetWidth || 1);
    const deltaIndex = Math.round(walk * itemsToShow);
    let newIndex = scrollLeftRef.current - deltaIndex;
    newIndex = Math.max(0, Math.min(newIndex, media.length - itemsToShow));
    setCurrentIndex(newIndex);
  }, [isDragging, itemsToShow, media.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsScrollLocked(false);
    resetAutoScroll();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setIsScrollLocked(false);
      resetAutoScroll();
    }
  }, [isDragging]);

  const autoScroll = useCallback(() => {
    if (isScrollLocked || isDragging || isTimelineHovered) return;
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, media.length - itemsToShow);
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
  }, [media.length, itemsToShow, isScrollLocked, isDragging, isTimelineHovered]);

  const resetAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (!isScrollLocked && !isDragging && !isTimelineHovered) {
      autoScrollRef.current = setInterval(autoScroll, 3000);
    }
  }, [autoScroll, isScrollLocked, isDragging, isTimelineHovered]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    if (scrollTimeoutRef.current) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? 
      Math.sign(e.deltaX) : 
      Math.sign(e.deltaY);

    const newIndex = currentIndex + delta;

    if (newIndex >= 0 && newIndex <= media.length - itemsToShow) {
      setCurrentIndex(newIndex);
      
      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null;
      }, 100);
    } else if (newIndex < 0) {
      setCurrentIndex(media.length - itemsToShow);
    } else if (newIndex > media.length - itemsToShow) {
      setCurrentIndex(0);
    }
  }, [currentIndex, itemsToShow, media.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.closest('.carousel-container')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setCurrentIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setCurrentIndex(prev => Math.min(media.length - itemsToShow, prev + 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [itemsToShow, media.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          setCurrentIndex(prev => Math.min(media.length - itemsToShow, prev + 1));
        } else {
          setCurrentIndex(prev => Math.max(0, prev - 1));
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleWheel]);

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

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [resetAutoScroll]);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape' && hoveredIndex !== null) {
        setHoveredIndex(null);
        setIsScrollLocked(false);
        setIsDragging(false);
        resetAutoScroll();
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [hoveredIndex, resetAutoScroll]);

  const renderCarouselContent = useCallback(() => {
    return (
      <div
        ref={containerRef}
        className={`flex transition-transform duration-500 ease-in-out h-full carousel-container focus:outline-none ${
          isScrollLocked ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsTimelineHovered(true)}
        onMouseOut={() => {
          setIsTimelineHovered(false);
          if (!isScrollLocked && !isDragging) resetAutoScroll();
        }}
        tabIndex={0}
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
            modalContainerRef={modalContainerRef}
          />
        ))}
      </div>
    );
  }, [currentIndex, itemsToShow, isScrollLocked, media, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, onHoverStart, onHoverEnd, timelineId, resetAutoScroll, isDragging]);

  const modalContent = useMemo(() => {
    if (hoveredIndex === null || !modalRoot || timelineId === 'event-upgraded-iphone-reels') return null;
    const mediaItem = media[hoveredIndex];
    if (!mediaItem) return null;
    if (mediaItem.type === MediaType.BeforeAfter || mediaItem.type === MediaType.YouTubeVideo) return null;

    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
        onClick={() => {
          setHoveredIndex(null);
          setIsScrollLocked(false);
        }}
      >
        <div
          ref={modalContainerRef}
          className="relative bg-black rounded-lg overflow-hidden pointer-events-auto"
          style={{
            maxWidth: '85vw',
            maxHeight: '85vh',
            border: '3px solid #fff',
            boxShadow: '0 0 25px rgba(255, 255, 255, 0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseLeave={() => {
            setHoveredIndex(null);
            setIsScrollLocked(false);
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            <MediaRenderer
              mediaItem={mediaItem}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {mediaItem.description && (
            <div className="absolute bottom-0 left-0 right-0 text-center py-4 px-6 bg-gradient-to-t from-black via-black/80 to-transparent">
              <p className="text-white text-base font-['Roboto Mono'] max-w-3xl mx-auto">{mediaItem.description}</p>
            </div>
          )}
        </div>
      </div>,
      modalRoot
    );
  }, [hoveredIndex, modalRoot, timelineId, media]);

  return (
    <>
      {modalContent}
      <div className="relative overflow-hidden h-[300px] sm:h-[400px]">
        {renderCarouselContent()}
        {isScrollLocked && !isDragging && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs select-none pointer-events-none">
            Scroll or use arrow keys to navigate
          </div>
        )}
      </div>
    </>
  );
});

// Utility debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

export default Carousel;
