
import { Task } from "@/components/tasks/TaskItem";
import TaskItem from "@/components/tasks/TaskItem";
import EmptyColumnState from "./EmptyColumnState";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, useRef } from "react";

interface TasksListProps {
  tasks: Task[];
  columnId: string;
  onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onCompleteTask: (taskId: string, completed: boolean, columnId: string) => void;
}

const TasksList = ({
  tasks,
  columnId,
  onDragStart,
  onEditTask,
  onDeleteTask,
  onCompleteTask
}: TasksListProps) => {
  const isMobile = useIsMobile();
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [initialTouch, setInitialTouch] = useState<{x: number, y: number} | null>(null);
  const [currentTouchPosition, setCurrentTouchPosition] = useState<{x: number, y: number} | null>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [longPressTimer]);

  // Clear scrolling interval when drag ends
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
      
      // Detect if touch is near the edge of the container
      const edgeThreshold = 60; // pixels from edge to trigger scrolling
      
      // Auto-scroll left/right when near edges
      if (currentTouchPosition.x < containerRect.left + edgeThreshold) {
        scrollContainer.scrollLeft -= scrollSpeed;
      } else if (currentTouchPosition.x > containerRect.right - edgeThreshold) {
        scrollContainer.scrollLeft += scrollSpeed;
      }
    }, 16); // ~60fps
  };

  const handleTouchStart = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    setInitialTouch({ x: touch.clientX, y: touch.clientY });
    
    const timer = setTimeout(() => {
      setDraggingTask(taskId);
      
      // Trigger visual feedback that the item is draggable
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.style.opacity = '0.7';
        element.style.transform = 'scale(1.02)';
        element.style.zIndex = '100';
      }
      
      // Start auto-scrolling mechanism
      startAutoScroll();
    }, 500); // 500ms for long press
    
    setLongPressTimer(timer);
  };

  const handleTouchEnd = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile) return;
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // If we were dragging, find a column to drop into
    if (draggingTask) {
      e.preventDefault();
      
      const dropPoint = currentTouchPosition;
      if (dropPoint) {
        // Find which column we're over
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
          const targetColumnId = targetColumn.id || 
                              targetColumn.getAttribute('data-column-id') || 
                              Array.from(columns).indexOf(targetColumn).toString();
          
          // Create and dispatch a synthetic drop event
          const dropEvent = new Event('drop') as any;
          dropEvent.preventDefault = () => {};
          dropEvent.dataTransfer = {
            getData: (type: string) => {
              if (type === 'taskId') return taskId;
              if (type === 'sourceColumnId') return columnId;
              return '';
            }
          };
          
          // Manually trigger the drop handler
          const dropHandler = (targetColumn as any).ondrop;
          if (dropHandler && typeof dropHandler === 'function') {
            dropHandler(dropEvent);
          }
        }
      }
    }
    
    setDraggingTask(null);
    setInitialTouch(null);
    setCurrentTouchPosition(null);
    
    // Clear auto-scroll interval
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
    
    // Reset styles
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
    setCurrentTouchPosition({ x: touch.clientX, y: touch.clientY });
    
    // If not dragging, check if this is a scroll attempt
    if (!draggingTask) {
      if (longPressTimer && initialTouch) {
        // If moved more than 10px, cancel the long press timer
        const deltaX = Math.abs(touch.clientX - initialTouch.x);
        const deltaY = Math.abs(touch.clientY - initialTouch.y);
        
        if (deltaX > 10 || deltaY > 10) {
          clearTimeout(longPressTimer);
          setLongPressTimer(null);
        }
      }
      return;
    }
    
    e.preventDefault(); // Prevent scrolling when dragging
    
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      // Move the element with the touch
      element.style.position = 'fixed';
      element.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
      element.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
      element.style.pointerEvents = 'none'; // Prevent touch events on the floating element
    }
    
    // Check if we need to auto-scroll
    if (draggingTask) {
      startAutoScroll();
    }
  };
  
  return (
    <div className="task-list space-y-2 min-h-[100px]">
      {tasks.length === 0 ? (
        <EmptyColumnState />
      ) : (
        tasks.map(task => (
          <div 
            key={task.id}
            id={`task-${task.id}`}
            draggable={!isMobile ? "true" : undefined}
            onDragStart={(e) => !isMobile && onDragStart(e, task.id, columnId)}
            onTouchStart={(e) => handleTouchStart(e, task.id)}
            onTouchEnd={(e) => handleTouchEnd(e, task.id)}
            onTouchMove={(e) => handleTouchMove(e, task.id)}
            className={`transition-transform ${!isMobile ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            <TaskItem
              task={task}
              onComplete={(id, completed) => onCompleteTask(id, completed, columnId)}
              onDelete={(id) => onDeleteTask(id, columnId)}
              onEdit={(task) => onEditTask(task)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default TasksList;
