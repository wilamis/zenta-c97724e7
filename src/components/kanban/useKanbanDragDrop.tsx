
import { Task } from "@/components/tasks/TaskItem";
import { KanbanColumn } from "@/hooks/useKanbanBoard";

interface UseKanbanDragDropProps {
  columns: KanbanColumn[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
  draggedTaskInfo: { taskId: string, sourceColumnId: string } | null;
  setDraggedTaskInfo: React.Dispatch<React.SetStateAction<{ taskId: string, sourceColumnId: string } | null>>;
  toast: any;
}

export function useKanbanDragDrop({
  columns,
  setColumns,
  draggedTaskInfo,
  setDraggedTaskInfo,
  toast
}: UseKanbanDragDropProps) {
  const handleDragStart = (e: React.DragEvent, taskId: string, columnId: string) => {
    // Store task and source column information in state for better reliability
    setDraggedTaskInfo({ taskId, sourceColumnId: columnId });
    
    // Set data on the drag event for compatibility
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", columnId);
    
    // Set drag image and effects
    if (e.dataTransfer.setDragImage) {
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        e.dataTransfer.setDragImage(element, 20, 20);
      }
    }
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    // Try to get data from draggedTaskInfo state first (more reliable)
    let taskId = draggedTaskInfo?.taskId;
    let sourceColumnId = draggedTaskInfo?.sourceColumnId;
    
    // Fall back to dataTransfer if state isn't available
    if (!taskId) {
      taskId = e.dataTransfer.getData("taskId");
    }
    
    if (!sourceColumnId) {
      sourceColumnId = e.dataTransfer.getData("sourceColumnId");
    }
    
    // Clear dragged task info
    setDraggedTaskInfo(null);
    
    // Validation
    if (!taskId || !sourceColumnId || sourceColumnId === targetColumnId) {
      return;
    }
    
    // Find the task in the source column
    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    if (!sourceColumn) return;
    
    const task = sourceColumn.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Auto-complete task if dropped in "Done" column
    const targetColumn = columns.find(col => col.id === targetColumnId);
    const shouldAutoComplete = targetColumn?.title === "Done" && !task.completed;
    
    const updatedTask = shouldAutoComplete 
      ? { ...task, completed: true }
      : task;
    
    console.log("Moving task:", task.title, "from", sourceColumnId, "to", targetColumnId);
    
    // Create a new array of columns to avoid mutation
    const updatedColumns = columns.map(column => {
      // Remove from source column
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter(t => t.id !== taskId)
        };
      }
      // Add to target column
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, updatedTask]
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    
    if (shouldAutoComplete) {
      toast({
        title: "Task completed",
        description: `Task "${task.title}" was automatically marked as complete`,
      });
    } else {
      const targetColumn = columns.find(col => col.id === targetColumnId);
      if (targetColumn) {
        toast({
          title: "Task moved",
          description: `Task moved to ${targetColumn.title}`,
        });
      }
    }
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop
  };
}
