
import { Task } from "@/components/tasks/TaskItem";
import TaskItem from "@/components/tasks/TaskItem";
import EmptyColumnState from "./EmptyColumnState";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

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
  
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  const handleTouchStart = (taskId: string) => {
    if (!isMobile) return;
    
    const timer = setTimeout(() => {
      setDraggingTask(taskId);
      // Trigger visual feedback that the item is draggable
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.style.opacity = '0.7';
        element.style.transform = 'scale(1.02)';
      }
    }, 500); // 500ms for long press
    
    setLongPressTimer(timer);
  };

  const handleTouchEnd = (taskId: string) => {
    if (!isMobile) return;
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    setDraggingTask(null);
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      element.style.opacity = '1';
      element.style.transform = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent, taskId: string) => {
    if (!isMobile || !draggingTask) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.getElementById(`task-${taskId}`);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      element.style.position = 'fixed';
      element.style.left = `${touch.clientX - rect.width / 2}px`;
      element.style.top = `${touch.clientY - rect.height / 2}px`;
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
            onTouchStart={() => handleTouchStart(task.id)}
            onTouchEnd={() => handleTouchEnd(task.id)}
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
