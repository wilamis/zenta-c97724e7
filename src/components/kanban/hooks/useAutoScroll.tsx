
import { useRef, useEffect } from 'react';

interface UseAutoScrollProps {
  draggingTask: string | null;
  currentTouchPosition: { x: number; y: number } | null;
}

export function useAutoScroll({ draggingTask, currentTouchPosition }: UseAutoScrollProps) {
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clean up the interval when dragging stops or component unmounts
    if (!draggingTask && scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
    
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [draggingTask]);

  const startAutoScroll = () => {
    if (scrollInterval.current) return;
    
    scrollInterval.current = setInterval(() => {
      if (!currentTouchPosition || !draggingTask) return;
      
      const scrollContainer = document.querySelector('.kanban-board-container') as HTMLElement;
      if (!scrollContainer) return;
      
      const containerRect = scrollContainer.getBoundingClientRect();
      const scrollSpeed = 10; // Increased from 5 to 10 for more responsive scrolling
      const edgeThreshold = 80; // Increased from 60 to 80 pixels for a wider activation area
      
      // Calculate scroll amount based on how close to the edge
      if (currentTouchPosition.x < containerRect.left + edgeThreshold) {
        // Calculate a proportional scroll speed based on how close to the edge
        const distance = currentTouchPosition.x - containerRect.left;
        const factor = Math.max(0, 1 - distance / edgeThreshold);
        scrollContainer.scrollLeft -= Math.ceil(scrollSpeed * factor * 2);
      } else if (currentTouchPosition.x > containerRect.right - edgeThreshold) {
        const distance = containerRect.right - currentTouchPosition.x;
        const factor = Math.max(0, 1 - distance / edgeThreshold);
        scrollContainer.scrollLeft += Math.ceil(scrollSpeed * factor * 2);
      }
    }, 16); // ~60fps
  };
  
  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  return { startAutoScroll, stopAutoScroll };
}
