import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  RefObject,
} from 'react';
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
  onPreviewOpen: (index: number) => void;
  onPreviewClose: (index: number) => void;
  timelineId?: string;
  previewModalRef?: RefObject<HTMLDivElement>;
}

const CarouselSlideItem: React.FC<CarouselSlideItemProps> = React.memo(
  ({
    item,
    itemsToShow,
    index,
    onPreviewOpen,
    onPreviewClose,
    timelineId,
    previewModalRef,
  }) => {
    const isReelsTimeline = timelineId === 'event-upgraded-iphone-reels';
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const closePreviewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isHoveredRef = useRef(false);
    const itemRef = useRef<HTMLDivElement>(null);
    const [cursorPointer, setCursorPointer] = useState(false);

    const clearAllTimeouts = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      if (closePreviewTimeoutRef.current) {
        clearTimeout(closePreviewTimeoutRef.current);
        closePreviewTimeoutRef.current = null;
      }
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
        cursorTimeoutRef.current = null;
      }
    };

    const handlePointerEnter = useCallback(() => {
      if (isReelsTimeline) return;
      isHoveredRef.current = true;

      // Cancel any scheduled close
      if (closePreviewTimeoutRef.current) {
        clearTimeout(closePreviewTimeoutRef.current);
        closePreviewTimeoutRef.current = null;
      }

      // Cursor pointer delay 300ms
      cursorTimeoutRef.current = setTimeout(() => {
        setCursorPointer(true);
      }, 300);

      // Hover idle 1000ms to open preview
      hoverTimeoutRef.current = setTimeout(() => {
        if (isHoveredRef.current) {
          onPreviewOpen(index);
        }
      }, 1000);
    }, [index, isReelsTimeline, onPreviewOpen]);

    const handlePointerLeave = useCallback(
      (e: React.PointerEvent) => {
        if (isReelsTimeline) return;

        const relatedTarget = e.relatedTarget as HTMLElement | null;

        // If pointer moved into preview modal, do NOT close preview
        if (
          previewModalRef?.current &&
          relatedTarget &&
          previewModalRef.current.contains(relatedTarget)
        ) {
          // Pointer moved to modal, keep preview open
          return;
        }

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

        // Delay close preview 200ms to prevent flicker
        closePreviewTimeoutRef.current = setTimeout(() => {
          if (!isHoveredRef.current) {
            onPreviewClose(index);
          }
        }, 200);
      },
      [index, isReelsTimeline, onPreviewClose, previewModalRef]
    );

    const handleClick = useCallback(() => {
      if (isReelsTimeline) return;
      clearAllTimeouts();
      onPreviewOpen(index);
    }, [index, isReelsTimeline, onPreviewOpen]);

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
        className={`relative flex-shrink-0 ${
          !isReelsTimeline && cursorPointer ? 'cursor-pointer' : ''
        }`}
        style={{ width: `calc(100% / ${itemsToShow})`, height: '100%' }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        role="group"
        aria-roledescription="slide"
        data-index={index}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            clearAllTimeouts();
            onPreviewOpen(index);
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
  }
);

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

  // Ref for preview modal container
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const onPreviewOpen = useCallback(
    (index: number) => {
      if (isDragging) return;
      setHoveredIndex(index);
      setIsScrollLocked(true);
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    },
    [isDragging]
  );

  const onPreviewClose = useCallback(
    (index: number) => {
      setHoveredIndex((current) => (current === index ? null : current));
      setIsScrollLocked(false);
      setIsDragging(false);
      if (!isTimelineHovered) resetAutoScroll();
    },
    [isTimelineHovered]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setIsScrollLocked(true);
      startXRef.current = e.pageX - (containerRef.current?.offsetLeft || 0);
      scrollLeftRef.current = currentIndex;
    },
    [currentIndex]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - (containerRef.current?.offsetLeft || 0);
      const walk = (x - startXRef.current) / (containerRef.current?.offsetWidth || 1);
      const deltaIndex = Math.round(walk * itemsToShow);
      let newIndex = scrollLeftRef.current - deltaIndex;
      newIndex = Math.max(0, Math.min(newIndex, media.length - itemsToShow));
      setCurrentIndex(newIndex);

      if (hoveredIndex !== null) {
        setHoveredIndex(null);
      }
    },
    [isDragging, itemsToShow, media.length, hoveredIndex]
  );

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

    setCurrentIndex((prev) => {
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

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isScrollLocked) return;
      e.preventDefault();

      if (scrollTimeoutRef.current) return;

      const delta = Math.sign(e.deltaX || e.deltaY);
      const newIndex = currentIndex + delta;

      if (newIndex >= 0 && newIndex <= media.length - itemsToShow) {
        setCurrentIndex(newIndex);
        scrollTimeoutRef.current = setTimeout(() => {
          scrollTimeoutRef.current = null;
        }, 150);
      }
    },
    [currentIndex, itemsToShow, media.length, isScrollLocked]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
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

  const renderCarouselContent = useCallback(() => (
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
        if (!isScrollLocked && !isDragging) resetAutoScroll();
      }}
    >
      {media.map((item, index) => (
        <CarouselSlideItem
          key={`${item.src}-${index}`}
          item={item}
          itemsToShow={itemsToShow}
          index={index}
          onPreviewOpen={onPreviewOpen}
          onPreviewClose={onPreviewClose}
          timelineId={timelineId}
          previewModalRef={modalContainerRef}
        />
      ))}
    </div>
  ), [
    currentIndex,
    itemsToShow,
    isScrollLocked,
    media,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    onPreviewOpen,
    onPreviewClose,
    timelineId,
    resetAutoScroll,
    isDragging,
  ]);

  const modalContent = useMemo(() => {
    if (
      hoveredIndex === null ||
      !modalRoot ||
      timelineId === 'event-upgraded-iphone-reels'
    )
      return null;

    const mediaItem = media[hoveredIndex];
    if (!mediaItem) return null;

    if (
      mediaItem.type === MediaType.BeforeAfter ||
      mediaItem.type === MediaType.YouTubeVideo
    )
      return null;

    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const safeMargin = 32;

    const maxHeight = windowHeight - (headerHeight + safeMargin * 2);
    const maxWidth = windowWidth - safeMargin * 2;
    const top = headerHeight + safeMargin;

    // Close preview if pointer leaves modal (and does not enter thumbnail)
    const handleModalPointerLeave = (e: React.PointerEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      if (
        relatedTarget &&
        !modalContainerRef.current?.contains(relatedTarget)
      ) {
        // Pointer left modal, close preview
        setHoveredIndex(null);
        setIsScrollLocked(false);
        setIsDragging(false);
        resetAutoScroll();
      }
    };

    return ReactDOM.createPortal(
      <div
        ref={modalContainerRef}
        onPointerLeave={handleModalPointerLeave}
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center p-8"
        style={{ paddingTop: top }}
      >
        <div
          className="relative bg-transparent rounded-lg overflow-hidden pointer-events-auto"
          style={{
            maxHeight,
            maxWidth,
            border: '6px solid white',
            boxSizing: 'border-box',
            backgroundColor: 'rgba(0,0,0,0.9)',
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            <MediaRenderer
              mediaItem={mediaItem}
              className="max-w-full max-h-full object-contain rounded-md"
            />
          </div>
          {mediaItem.description && (
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black/50 backdrop-blur-sm">
              <p className="text-sm font-['Roboto Mono']">
                {mediaItem.description}
              </p>
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
            Scroll or drag to navigate
          </div>
        )}
      </div>
    </>
  );
});

// Debounce utility
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
