
import { Task } from "@/components/tasks/TaskItem";
import { KanbanColumn } from "@/hooks/useKanbanBoard";
import { safelyUpdateStorage, updateTasksInLists } from "@/utils/taskStorageUtils";

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
    // Find the task to add to deleted tasks
    let taskToDelete: Task | undefined;
    let taskListId: string | undefined;
    
    columns.forEach(col => {
      if (col.id === columnId) {
        const task = col.tasks.find(t => t.id === taskId);
        if (task) {
          taskToDelete = task;
          taskListId = task.listId;
        }
      }
    });
    
    if (!taskToDelete) return;
    
    try {
      // Add task to deleted tasks storage with deletion date
      const deletedTask = {
        ...taskToDelete,
        deletedAt: new Date().toISOString()
      };
      
      // Get existing deleted tasks
      const savedDeletedTasks = localStorage.getItem("zenta-deleted-tasks") || "[]";
      const deletedTasks = JSON.parse(savedDeletedTasks);
      deletedTasks.push(deletedTask);
      
      // Save deleted tasks to storage
      safelyUpdateStorage("zenta-deleted-tasks", deletedTasks);

      // Remove task from column
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
      if (taskListId) {
        updateTasksInLists(updatedColumns, taskListId);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Erro ao excluir tarefa",
        description: "Ocorreu um erro ao mover a tarefa para a lixeira",
        variant: "destructive",
      });
    }
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
