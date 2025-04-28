
import { useEffect } from 'react';
import { useTouchState } from './useTouchState';
import { useAutoScroll } from './useAutoScroll';

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
  const { touchState, updateTouchState } = useTouchState();
  const { startAutoScroll } = useAutoScroll({
    draggingTask: touchState.draggingTask,
    currentTouchPosition: touchState.currentTouchPosition
  });

  const handleTouchStart = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    const longPressTimer = setTimeout(() => {
      updateTouchState({ draggingTask: taskId });
      
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.style.opacity = '0.7';
        element.style.transform = 'scale(1.02)';
        element.style.zIndex = '100';
      }
      
      startAutoScroll();
    }, 500);

    updateTouchState({
      initialTouch: { x: touch.clientX, y: touch.clientY },
      longPressTimer
    });
  };

  const handleTouchEnd = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    if (touchState.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
    }
    
    if (touchState.draggingTask) {
      e.preventDefault();
      
      const dropPoint = touchState.currentTouchPosition;
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
    updateTouchState({
      longPressTimer: null,
      draggingTask: null,
      initialTouch: null,
      currentTouchPosition: null
    });
    
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
    updateTouchState({ 
      currentTouchPosition: { x: touch.clientX, y: touch.clientY } 
    });
    
    if (!touchState.draggingTask) {
      if (touchState.longPressTimer && touchState.initialTouch) {
        const deltaX = Math.abs(touch.clientX - touchState.initialTouch.x);
        const deltaY = Math.abs(touch.clientY - touchState.initialTouch.y);
        
        if (deltaX > 10 || deltaY > 10) {
          clearTimeout(touchState.longPressTimer);
          updateTouchState({ longPressTimer: null });
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
    
    if (touchState.draggingTask) {
      startAutoScroll();
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    draggingTask: touchState.draggingTask
  };
}
