
import { useEffect, useRef } from 'react';
import { useTouchState } from './useTouchState';
import { useAutoScroll } from './useAutoScroll';
import { debounce } from 'lodash';

interface UseTaskTouchInteractionsProps {
  isMobile: boolean;
  onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
  columnId: string;
  setDraggedTaskInfo: React.Dispatch<React.SetStateAction<{ taskId: string, sourceColumnId: string } | null>>;
}

export function useTaskTouchInteractions({ 
  isMobile, 
  onDragStart, 
  columnId,
  setDraggedTaskInfo
}: UseTaskTouchInteractionsProps) {
  const { touchState, updateTouchState } = useTouchState();
  const { startAutoScroll, stopAutoScroll } = useAutoScroll({
    draggingTask: touchState.draggingTask,
    currentTouchPosition: touchState.currentTouchPosition
  });
  
  // Create a ref to store columns DOM elements
  const columnsRef = useRef<Element[]>([]);
  
  // Get all column elements once
  useEffect(() => {
    if (isMobile && touchState.draggingTask) {
      columnsRef.current = Array.from(document.querySelectorAll('.kanban-column'));
    }
  }, [isMobile, touchState.draggingTask]);

  const handleTouchStart = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    const longPressTimer = setTimeout(() => {
      updateTouchState({ draggingTask: taskId });
      
      // Update the task appearance to indicate it's being dragged
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.style.opacity = '0.7';
        element.style.transform = 'scale(1.02)';
        element.style.zIndex = '100';
        element.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }
      
      // Inform the parent component about the drag operation
      setDraggedTaskInfo({ taskId, sourceColumnId: columnId });
      
      // Start the auto-scroll functionality
      startAutoScroll();
      
      // Provide haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 300); // Reduced from 500ms to 300ms for better responsiveness

    updateTouchState({
      initialTouch: { x: touch.clientX, y: touch.clientY },
      longPressTimer,
      currentTouchPosition: { x: touch.clientX, y: touch.clientY }
    });
  };

  // Optimized finding target column with debounce
  const findTargetColumn = useRef(
    debounce((position: { x: number, y: number }) => {
      if (!columnsRef.current.length) return null;
      
      return columnsRef.current.find(column => {
        const rect = column.getBoundingClientRect();
        return (
          position.x >= rect.left && 
          position.x <= rect.right && 
          position.y >= rect.top && 
          position.y <= rect.bottom
        );
      }) || null;
    }, 50)
  ).current;

  const handleTouchEnd = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    if (touchState.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
    }
    
    if (touchState.draggingTask) {
      // Prevent default only when actually dragging
      e.preventDefault();
      
      const dropPoint = touchState.currentTouchPosition;
      if (dropPoint) {
        const targetColumn = findTargetColumn(dropPoint);
        
        if (targetColumn) {
          const targetColumnId = targetColumn.getAttribute('data-column-id') || '';
          
          // Create a synthetic drop event
          const dropEvent = new Event('drop') as any;
          dropEvent.preventDefault = () => {};
          dropEvent.dataTransfer = {
            getData: (type: string) => {
              if (type === 'taskId') return taskId;
              if (type === 'sourceColumnId') return columnId;
              return '';
            }
          };
          
          // Trigger the drop handler
          const dropHandler = (targetColumn as any).ondrop;
          if (dropHandler && typeof dropHandler === 'function') {
            dropHandler(dropEvent);
          }
        }
      }
      
      // Stop auto-scrolling
      stopAutoScroll();
    }
    
    // Reset the touch state
    updateTouchState({
      longPressTimer: null,
      draggingTask: null,
      initialTouch: null,
      currentTouchPosition: null
    });
    
    // Reset task appearance
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.position = 'static';
      element.style.zIndex = 'auto';
      element.style.boxShadow = 'none';
    }
    
    // Clear the dragged task info in the parent component
    setDraggedTaskInfo(null);
  };

  const handleTouchMove = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    const newPosition = { x: touch.clientX, y: touch.clientY };
    
    // Update the current position
    updateTouchState({ currentTouchPosition: newPosition });
    
    // If not dragging yet, check if we need to cancel the long press
    if (!touchState.draggingTask) {
      if (touchState.longPressTimer && touchState.initialTouch) {
        const deltaX = Math.abs(touch.clientX - touchState.initialTouch.x);
        const deltaY = Math.abs(touch.clientY - touchState.initialTouch.y);
        
        // Cancel long press if moved more than threshold
        if (deltaX > 10 || deltaY > 10) {
          clearTimeout(touchState.longPressTimer);
          updateTouchState({ longPressTimer: null });
        }
      }
      return;
    }
    
    // Now we're actively dragging, prevent default to avoid page scrolling
    e.preventDefault();
    
    // Move the task element with the touch
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      element.style.position = 'fixed';
      element.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
      element.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
      element.style.pointerEvents = 'none';
      
      // Highlight the column being hovered
      const targetColumn = findTargetColumn(newPosition);
      
      // Remove highlight from all columns
      columnsRef.current.forEach(col => {
        (col as HTMLElement).style.backgroundColor = '';
        (col as HTMLElement).style.borderColor = '';
      });
      
      // Add highlight to the target column
      if (targetColumn) {
        (targetColumn as HTMLElement).style.backgroundColor = 'rgba(155, 135, 245, 0.1)';
        (targetColumn as HTMLElement).style.borderColor = '#9b87f5';
      }
    }
    
    // Continue auto-scrolling if needed
    startAutoScroll();
  };

  return {
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    draggingTask: touchState.draggingTask
  };
}
