
import { useRef, useEffect } from 'react';

interface UseAutoScrollProps {
  draggingTask: string | null;
  currentTouchPosition: { x: number; y: number } | null;
}

export function useAutoScroll({ draggingTask, currentTouchPosition }: UseAutoScrollProps) {
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!draggingTask && scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  }, [draggingTask]);

  const startAutoScroll = () => {
    if (scrollInterval.current) return;
    
    scrollInterval.current = setInterval(() => {
      if (!currentTouchPosition || !draggingTask) return;
      
      const scrollContainer = document.querySelector('.kanban-board-container') as HTMLElement;
      if (!scrollContainer) return;
      
      const containerRect = scrollContainer.getBoundingClientRect();
      const scrollSpeed = 5;
      const edgeThreshold = 60;
      
      if (currentTouchPosition.x < containerRect.left + edgeThreshold) {
        scrollContainer.scrollLeft -= scrollSpeed;
      } else if (currentTouchPosition.x > containerRect.right - edgeThreshold) {
        scrollContainer.scrollLeft += scrollSpeed;
      }
    }, 16);
  };

  useEffect(() => {
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  return { startAutoScroll };
}
