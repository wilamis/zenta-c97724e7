
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
    // Find the task to add to deleted tasks
    let taskToDelete: Task | undefined;
    columns.find(col => {
      const task = col.tasks.find(t => t.id === taskId);
      if (task) {
        taskToDelete = task;
        return true;
      }
      return false;
    });
    
    if (taskToDelete) {
      // Add task to deleted tasks storage with deletion date
      const deletedTask = {
        ...taskToDelete,
        deletedAt: new Date().toISOString()
      };
      
      const savedDeletedTasks = localStorage.getItem("zenta-deleted-tasks") || "[]";
      const deletedTasks = JSON.parse(savedDeletedTasks);
      deletedTasks.push(deletedTask);
      localStorage.setItem("zenta-deleted-tasks", JSON.stringify(deletedTasks));
    }

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
      title: "Tarefa movida para a lixeira",
      description: "A tarefa será permanentemente excluída após 30 dias",
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
