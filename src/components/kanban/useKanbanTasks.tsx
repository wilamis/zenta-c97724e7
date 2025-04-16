
import { Task } from "@/components/tasks/TaskItem";
import { KanbanColumn } from "@/hooks/useKanbanBoard";

interface UseKanbanTasksProps {
  columns: KanbanColumn[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
  setActiveColumn: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setIsTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
  activeColumn: string | null;
  editingTask: Task | null;
}

export function useKanbanTasks({ 
  columns, 
  setColumns, 
  setActiveColumn, 
  setEditingTask, 
  setIsTaskModalOpen,
  toast,
  activeColumn,
  editingTask
}: UseKanbanTasksProps) {
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

  const handleTaskSave = (task: Task) => {
    if (!activeColumn) return;
    
    let updatedColumns = [...columns];
    const columnIndex = updatedColumns.findIndex(col => col.id === activeColumn);
    
    if (columnIndex === -1) return;
    
    if (editingTask) {
      // Edit existing task
      updatedColumns[columnIndex].tasks = updatedColumns[columnIndex].tasks.map(t => 
        t.id === task.id ? task : t
      );
    } else {
      // Add new task with generated ID
      const newTask = {
        ...task,
        id: Date.now().toString()
      };
      updatedColumns[columnIndex].tasks = [...updatedColumns[columnIndex].tasks, newTask];
    }
    
    setColumns(updatedColumns);
    
    // Update list data if list ID is available
    const listId = task.listId || localStorage.getItem("current-list-id");
    if (listId) {
      updateTasksInLists(updatedColumns, listId);
    }
    
    toast({
      title: editingTask ? "Task updated" : "Task added",
      description: editingTask ? "Your task has been updated" : "New task has been added to the board",
    });
  };

  const handleTaskDelete = (taskId: string, columnId: string) => {
    // Find the task first to check for listId
    let taskToDelete: Task | undefined;
    const columnWithTask = columns.find(col => {
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
      title: "Task deleted",
      description: "The task has been removed from the board",
    });
  };

  const handleTaskComplete = (taskId: string, completed: boolean, columnId: string) => {
    // Find the task to check for listId
    let taskToUpdate: Task | undefined;
    const columnWithTask = columns.find(col => {
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

  // Helper function to update tasks in lists
  const updateTasksInLists = (updatedColumns: KanbanColumn[], listId: string) => {
    try {
      const savedLists = localStorage.getItem("task-lists");
      if (savedLists) {
        const lists = JSON.parse(savedLists);
        
        // Get all tasks from all columns
        const allTasks = updatedColumns.flatMap(col => col.tasks);
        
        const updatedLists = lists.map((list: any) => {
          if (list.id === listId) {
            // Filter tasks that belong to this list
            const listTasks = allTasks.filter(t => t.listId === listId);
            return {
              ...list,
              tasks: listTasks
            };
          }
          return list;
        });
        
        localStorage.setItem("task-lists", JSON.stringify(updatedLists));
        
        // Also update the tasks in general storage
        const tasksFromStorage = localStorage.getItem("zenta-tasks");
        if (tasksFromStorage) {
          try {
            const existingTasks = JSON.parse(tasksFromStorage);
            
            // Remove tasks associated with this list
            const filteredTasks = existingTasks.filter((t: Task) => t.listId !== listId);
            
            // Add updated tasks for this list
            const tasksForThisList = allTasks.filter(t => t.listId === listId);
            const updatedTasks = [...filteredTasks, ...tasksForThisList];
            
            localStorage.setItem("zenta-tasks", JSON.stringify(updatedTasks));
          } catch (e) {
            console.error("Error updating tasks storage:", e);
          }
        }
      }
    } catch (e) {
      console.error("Error updating lists:", e);
    }
  };

  return {
    handleAddTask,
    handleEditTask,
    handleTaskSave,
    handleTaskDelete,
    handleTaskComplete
  };
}
