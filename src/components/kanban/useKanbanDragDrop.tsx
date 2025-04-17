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
    setDraggedTaskInfo({ taskId, sourceColumnId: columnId });
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", columnId);
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
    
    let taskId = draggedTaskInfo?.taskId;
    let sourceColumnId = draggedTaskInfo?.sourceColumnId;
    
    if (!taskId) {
      taskId = e.dataTransfer.getData("taskId");
    }
    
    if (!sourceColumnId) {
      sourceColumnId = e.dataTransfer.getData("sourceColumnId");
    }
    
    setDraggedTaskInfo(null);
    
    if (!taskId || !sourceColumnId || sourceColumnId === targetColumnId) {
      return;
    }
    
    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    if (!sourceColumn) return;
    
    const task = sourceColumn.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const targetColumn = columns.find(col => col.id === targetColumnId);
    const shouldAutoComplete = targetColumn?.title === "Concluído" && !task.completed;
    
    const updatedTask = shouldAutoComplete 
      ? { ...task, completed: true }
      : (targetColumn?.title !== "Concluído" && task.completed)
        ? { ...task, completed: false }
        : task;
    
    const updatedColumns = columns.map(column => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter(t => t.id !== taskId)
        };
      }
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
        title: "Tarefa concluída",
        description: `Tarefa "${task.title}" foi automaticamente marcada como concluída`,
      });
    } else if (targetColumn?.title !== "Concluído" && task.completed) {
      toast({
        title: "Tarefa reaberta",
        description: `Tarefa "${task.title}" foi reaberta`,
      });
    } else {
      const targetColumn = columns.find(col => col.id === targetColumnId);
      if (targetColumn) {
        toast({
          title: "Tarefa movida",
          description: `Tarefa movida para ${targetColumn.title}`,
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
