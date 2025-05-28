import React, { useState, useRef, useEffect, useCallback } from 'react';
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
}

const CarouselSlideItem: React.FC<CarouselSlideItemProps> = ({
  item,
  itemsToShow,
  index,
  onHoverStart,
  onHoverEnd,
}) => (
  <div
    className="relative flex-shrink-0 cursor-pointer"
    style={{ width: `calc(100% / ${itemsToShow})`, height: '100%' }}
    onMouseEnter={() => onHoverStart(index)}
    onMouseLeave={() => onHoverEnd(index)}
    onTouchStart={() => onHoverStart(index)}
    onTouchEnd={() => onHoverEnd(index)}
    onTouchCancel={() => onHoverEnd(index)}
    onClick={() => onHoverStart(index)}
    role="group"
    aria-roledescription="slide"
  >
    <div className="flex items-center justify-center p-0.5 sm:p-1 rounded-md transition-transform duration-300 ease-in-out hover:scale-105 h-full">
      <MediaRenderer
        mediaItem={item}
        className="max-w-full max-h-full object-contain rounded-md"
      />
    </div>
  </div>
);

const Carousel: React.FC<CarouselProps> = ({ media, timelineId }) => {
  const [itemsToShow, setItemsToShow] = useState(3);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentHoverIndexRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const scrollDirectionRef = useRef(1);
  const isScrollingRef = useRef(false);
  const beforeAfterTransitionRef = useRef<NodeJS.Timeout | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showingAfter, setShowingAfter] = useState(false);

  const closeModal = useCallback(() => {
    setHoveredIndex(null);
    currentHoverIndexRef.current = null;
  }, []);

  useEffect(() => {
    if (hoveredIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      const modalContent = document.getElementById('modal-content');
      if (modalContent && !modalContent.contains(e.target as Node)) {
        closeModal();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hoveredIndex, closeModal]);

  const onHoverStart = useCallback((index: number) => {
    if (isScrollingRef.current) return;

    closeTimerRef.current && clearTimeout(closeTimerRef.current);
    idleTimerRef.current && clearTimeout(idleTimerRef.current);

    currentHoverIndexRef.current = index;
    idleTimerRef.current = setTimeout(() => {
      setHoveredIndex(index);
    }, 1250);
  }, []);

  const onHoverEnd = useCallback((index: number) => {
    idleTimerRef.current && clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;

    closeTimerRef.current = setTimeout(() => {
      setHoveredIndex((current) => (current === index ? null : current));
      closeTimerRef.current = null;
      currentHoverIndexRef.current = null;
    }, 200);
  }, []);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  useEffect(() => {
    if (timelineId === 'event-editing-mastery') {
      const transitionBeforeAfter = () => {
        setShowingAfter(prev => !prev);
        if (showingAfter) {
          setCurrentIndex(prev => {
            const nextIndex = prev + 2;
            return nextIndex >= media.length - 2 ? 0 : nextIndex;
          });
        }
      };

      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      if (beforeAfterTransitionRef.current) clearInterval(beforeAfterTransitionRef.current);

      beforeAfterTransitionRef.current = setInterval(transitionBeforeAfter, 1500);

      return () => {
        if (beforeAfterTransitionRef.current) {
          clearInterval(beforeAfterTransitionRef.current);
        }
      };
    } else {
      resetAutoScroll();
    }
  }, [timelineId, media.length, showingAfter]);

  const autoScroll = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, media.length - itemsToShow);
      const next = prev + 1;
      return next > maxIndex ? 0 : next;
    });
  };

  useEffect(() => {
    if (currentIndex > Math.max(0, media.length - itemsToShow)) {
      setCurrentIndex(0);
    }
  }, [itemsToShow, media.length, currentIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        isScrollingRef.current = true;

        let newIndex = currentIndex;
        if (e.deltaX > 0) newIndex = Math.min(currentIndex + 1, media.length - itemsToShow);
        else newIndex = Math.max(currentIndex - 1, 0);

        setCurrentIndex(newIndex);
        resetAutoScroll();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentIndex, itemsToShow, media.length]);

  useEffect(() => {
    if (isScrollingRef.current) {
      const timeout = setTimeout(() => {
        isScrollingRef.current = false;
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const resetAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(autoScroll, 3000);
  };

  const modalRoot = document.getElementById('modal-root');

  if (!media || media.length === 0) {
    return (
      <p className="text-gray-400 p-4 text-center font-['Roboto Mono']">
        No media to display.
      </p>
    );
  }

  const renderCarouselContent = () => {
    if (timelineId === 'event-editing-mastery') {
      return (
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
          }}
        >
          {media.map((item, index) => {
            const isBeforeImage = index % 2 === 0;
            const shouldShow = isBeforeImage ? !showingAfter : showingAfter;
            const pairIndex = Math.floor(index / 2);
            
            return (
              <div
                key={`${item.src}-${index}`}
                className={`relative flex-shrink-0 transition-opacity duration-500`}
                style={{ 
                  width: `calc(100% / ${itemsToShow})`,
                  opacity: shouldShow ? 1 : 0,
                  position: isBeforeImage ? 'relative' : 'absolute',
                  left: isBeforeImage ? 'auto' : `calc(100% / ${itemsToShow} * ${pairIndex})`,
                  height: '100%',
                  zIndex: shouldShow ? 2 : 1
                }}
              >
                <div className="relative flex items-center justify-center p-0.5 sm:p-1 rounded-md transition-transform duration-300 ease-in-out hover:scale-105 h-full">
                  <MediaRenderer
                    mediaItem={item}
                    className="max-w-full max-h-full object-contain rounded-md"
                  />
                  <div 
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                  >
                    <span className="text-base font-medium tracking-wider text-white font-['Helvetica Neue', 'Helvetica', 'Arial', sans-serif] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">
                      {isBeforeImage ? 'Before' : 'After'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{
          transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
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
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {hoveredIndex !== null && modalRoot
        ? ReactDOM.createPortal(
            <div
              className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4"
              aria-modal="true"
              role="dialog"
              tabIndex={-1}
              onMouseEnter={() => {
                if (closeTimerRef.current) {
                  clearTimeout(closeTimerRef.current);
                  closeTimerRef.current = null;
                }
              }}
              onTouchStart={() => {
                if (closeTimerRef.current) {
                  clearTimeout(closeTimerRef.current);
                  closeTimerRef.current = null;
                }
              }}
            >
              <div
                id="modal-content"
                className="bg-white rounded-lg shadow-lg p-6 max-w-[80vw] max-h-[90vh] flex flex-col items-center transition-all duration-500 ease-in-out overflow-auto"
                onMouseLeave={() => {
                  closeTimerRef.current = setTimeout(() => {
                    setHoveredIndex(null);
                    currentHoverIndexRef.current = null;
                    closeTimerRef.current = null;
                  }, 200);
                }}
                onMouseEnter={() => {
                  if (closeTimerRef.current) {
                    clearTimeout(closeTimerRef.current);
                    closeTimerRef.current = null;
                  }
                }}
                onTouchEnd={() => {
                  closeTimerRef.current = setTimeout(() => {
                    setHoveredIndex(null);
                    currentHoverIndexRef.current = null;
                    closeTimerRef.current = null;
                  }, 200);
                }}
                onTouchCancel={() => {
                  closeTimerRef.current = setTimeout(() => {
                    setHoveredIndex(null);
                    currentHoverIndexRef.current = null;
                    closeTimerRef.current = null;
                  }, 200);
                }}
              >
                <div className="flex-shrink-0 max-w-full max-h-[76vh] border border-white rounded-md overflow-hidden">
                  <MediaRenderer
                    mediaItem={media[hoveredIndex]}
                    className="object-contain rounded-md max-w-full max-h-full h-auto w-auto block"
                  />
                </div>

                {media[hoveredIndex].description && (
                  <div className="mt-4 text-black font-['Roboto Mono'] text-center max-w-[90%] whitespace-pre-wrap">
                    {media[hoveredIndex].description}
                  </div>
                )}
              </div>
            </div>,
            modalRoot
          )
        : null}

      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: '400px' }}
      >
        {renderCarouselContent()}
      </div>
    </>
  );
};

export default Carousel;
