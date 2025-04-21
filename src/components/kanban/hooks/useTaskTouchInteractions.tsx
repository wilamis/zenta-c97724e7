
import { useState, useEffect, useRef } from 'react';

interface TouchState {
  longPressTimer: NodeJS.Timeout | null;
  draggingTask: string | null;
  initialTouch: { x: number; y: number } | null;
  currentTouchPosition: { x: number; y: number } | null;
  scrollInterval: React.MutableRefObject<NodeJS.Timeout | null>;
}

interface UseTaskTouchInteractionsProps {
  isMobile: boolean;
  onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
  columnId: string;
}

export function useTaskTouchInteractions({ 
  isMobile, 
  onDragStart, 
  columnId 
}: UseTaskTouchInteractionsProps) {
  const [state, setState] = useState<TouchState>({
    longPressTimer: null,
    draggingTask: null,
    initialTouch: null,
    currentTouchPosition: null,
    scrollInterval: useRef<NodeJS.Timeout | null>(null)
  });
  
  useEffect(() => {
    return () => {
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer);
      }
      if (state.scrollInterval.current) {
        clearInterval(state.scrollInterval.current);
      }
    };
  }, [state.longPressTimer]);

  useEffect(() => {
    if (!state.draggingTask && state.scrollInterval.current) {
      clearInterval(state.scrollInterval.current);
      state.scrollInterval.current = null;
    }
  }, [state.draggingTask]);

  const startAutoScroll = () => {
    if (state.scrollInterval.current) return;
    
    state.scrollInterval.current = setInterval(() => {
      if (!state.currentTouchPosition || !state.draggingTask) return;
      
      const scrollContainer = document.querySelector('.kanban-board-container') as HTMLElement;
      if (!scrollContainer) return;
      
      const containerRect = scrollContainer.getBoundingClientRect();
      const scrollSpeed = 5;
      const edgeThreshold = 60;
      
      if (state.currentTouchPosition.x < containerRect.left + edgeThreshold) {
        scrollContainer.scrollLeft -= scrollSpeed;
      } else if (state.currentTouchPosition.x > containerRect.right - edgeThreshold) {
        scrollContainer.scrollLeft += scrollSpeed;
      }
    }, 16);
  };

  const handleTouchStart = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    setState(prev => ({
      ...prev,
      initialTouch: { x: touch.clientX, y: touch.clientY },
      longPressTimer: setTimeout(() => {
        setState(prev => ({ ...prev, draggingTask: taskId }));
        
        const element = document.getElementById(`task-${taskId}`);
        if (element) {
          element.style.opacity = '0.7';
          element.style.transform = 'scale(1.02)';
          element.style.zIndex = '100';
        }
        
        startAutoScroll();
      }, 500)
    }));
  };

  const handleTouchEnd = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
    }
    
    if (state.draggingTask) {
      e.preventDefault();
      
      const dropPoint = state.currentTouchPosition;
      if (dropPoint) {
        const columns = document.querySelectorAll('.kanban-column');
        let targetColumn: Element | null = null;
        
        columns.forEach(column => {
          const rect = column.getBoundingClientRect();
          if (
            dropPoint.x >= rect.left && 
            dropPoint.x <= rect.right && 
            dropPoint.y >= rect.top && 
            dropPoint.y <= rect.bottom
          ) {
            targetColumn = column;
          }
        });
        
        if (targetColumn) {
          const targetColumnId = targetColumn.getAttribute('data-column-id') || '';
          
          const dropEvent = new Event('drop') as any;
          dropEvent.preventDefault = () => {};
          dropEvent.dataTransfer = {
            getData: (type: string) => {
              if (type === 'taskId') return taskId;
              if (type === 'sourceColumnId') return columnId;
              return '';
            }
          };
          
          const dropHandler = (targetColumn as any).ondrop;
          if (dropHandler && typeof dropHandler === 'function') {
            dropHandler(dropEvent);
          }
        }
      }
    }
    
    // Reset state
    setState({
      longPressTimer: null,
      draggingTask: null,
      initialTouch: null,
      currentTouchPosition: null,
      scrollInterval: state.scrollInterval
    });
    
    if (state.scrollInterval.current) {
      clearInterval(state.scrollInterval.current);
      state.scrollInterval.current = null;
    }
    
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.position = 'static';
      element.style.zIndex = 'auto';
    }
  };

  const handleTouchMove = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    setState(prev => ({ ...prev, currentTouchPosition: { x: touch.clientX, y: touch.clientY } }));
    
    if (!state.draggingTask) {
      if (state.longPressTimer && state.initialTouch) {
        const deltaX = Math.abs(touch.clientX - state.initialTouch.x);
        const deltaY = Math.abs(touch.clientY - state.initialTouch.y);
        
        if (deltaX > 10 || deltaY > 10) {
          clearTimeout(state.longPressTimer);
          setState(prev => ({ ...prev, longPressTimer: null }));
        }
      }
      return;
    }
    
    e.preventDefault();
    
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      element.style.position = 'fixed';
      element.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
      element.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
      element.style.pointerEvents = 'none';
    }
    
    if (state.draggingTask) {
      startAutoScroll();
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    draggingTask: state.draggingTask
  };
}
