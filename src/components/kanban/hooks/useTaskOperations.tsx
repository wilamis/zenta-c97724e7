import { Task } from "@/components/tasks/TaskItem";
import { KanbanColumn } from "@/hooks/useKanbanBoard";
import { updateTasksInLists } from "@/utils/taskStorageUtils";

interface UseTaskOperationsProps {
  columns: KanbanColumn[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
  setActiveColumn: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setIsTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
}

export function useTaskOperations({
  columns,
  setColumns, 
  setActiveColumn, 
  setEditingTask, 
  setIsTaskModalOpen,
  toast
}: UseTaskOperationsProps) {
  
  const handleAddTask = (columnId: string) => {
    setActiveColumn(columnId);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task, columnId: string) => {
    setActiveColumn(columnId);
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskDelete = (taskId: string, columnId: string) => {
    // Find the task first to check for listId
    let taskToDelete: Task | undefined;
    columns.find(col => {
      const task = col.tasks.find(t => t.id === taskId);
      if (task) {
        taskToDelete = task;
        return true;
      }
      return false;
    });
    
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    
    // Update list data if needed
    if (taskToDelete?.listId) {
      updateTasksInLists(updatedColumns, taskToDelete.listId);
    }
    
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi removida do quadro",
    });
  };

  const handleTaskComplete = (taskId: string, completed: boolean, columnId: string) => {
    // Find the task to check for listId
    let taskToUpdate: Task | undefined;
    columns.find(col => {
      const task = col.tasks.find(t => t.id === taskId);
      if (task) {
        taskToUpdate = task;
        return true;
      }
      return false;
    });
    
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map(task => 
            task.id === taskId ? { ...task, completed } : task
          )
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    
    // Update list data if needed
    if (taskToUpdate?.listId) {
      updateTasksInLists(updatedColumns, taskToUpdate.listId);
    }
  };

  return {
    handleAddTask,
    handleEditTask,
    handleTaskDelete,
    handleTaskComplete
  };
}
