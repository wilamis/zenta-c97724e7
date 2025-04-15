
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
      const savedLists = localStorage.getItem("task-lists");
      if (savedLists) {
        const lists = JSON.parse(savedLists);
        const updatedLists = lists.map((list: any) => {
          if (list.id === listId) {
            // Get all tasks from all columns
            const allTasks = updatedColumns.flatMap(col => col.tasks);
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
      }
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
      const savedLists = localStorage.getItem("task-lists");
      if (savedLists) {
        const lists = JSON.parse(savedLists);
        const updatedLists = lists.map((list: any) => {
          if (list.id === taskToDelete?.listId) {
            return {
              ...list,
              tasks: list.tasks.filter((t: Task) => t.id !== taskId)
            };
          }
          return list;
        });
        localStorage.setItem("task-lists", JSON.stringify(updatedLists));
      }
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
      const savedLists = localStorage.getItem("task-lists");
      if (savedLists) {
        const lists = JSON.parse(savedLists);
        const updatedLists = lists.map((list: any) => {
          if (list.id === taskToUpdate?.listId) {
            return {
              ...list,
              tasks: list.tasks.map((t: Task) => 
                t.id === taskId ? { ...t, completed } : t
              )
            };
          }
          return list;
        });
        localStorage.setItem("task-lists", JSON.stringify(updatedLists));
      }
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
