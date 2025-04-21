
import { useState } from "react";
import { Task } from "@/components/tasks/TaskItem";

interface UseColumnActionsProps {
  columnId: string;
  tasks: Task[];
  onDeleteTask: (taskId: string, columnId: string) => void;
}

export function useColumnActions({ columnId, tasks, onDeleteTask }: UseColumnActionsProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [isColumnDropTarget, setIsColumnDropTarget] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(true);
  };

  const handleDragLeave = () => {
    setIsDropTarget(false);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleColumnDragLeave = () => {
    setIsColumnDropTarget(false);
  };

  const handleClearColumn = async () => {
    if (isClearing || tasks.length === 0) return;
    
    setIsClearing(true);
    
    try {
      // Create a copy of all tasks to delete
      const tasksCopy = [...tasks];
      
      // Process each task sequentially to ensure all are deleted
      for (const task of tasksCopy) {
        onDeleteTask(task.id, columnId);
      }
    } catch (error) {
      console.error("Error clearing column:", error);
    } finally {
      setIsClearing(false);
      setIsClearDialogOpen(false);
    }
  };

  return {
    isRenameOpen,
    setIsRenameOpen,
    isDropTarget,
    setIsDropTarget,
    isColumnDropTarget,
    setIsColumnDropTarget,
    isClearDialogOpen,
    setIsClearDialogOpen,
    isClearing,
    handleDragOver,
    handleDragLeave,
    handleColumnDragOver,
    handleColumnDragLeave,
    handleClearColumn
  };
}
