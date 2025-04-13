
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
    
    toast({
      title: editingTask ? "Task updated" : "Task added",
      description: editingTask ? "Your task has been updated" : "New task has been added to the board",
    });
  };

  const handleTaskDelete = (taskId: string, columnId: string) => {
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
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from the board",
    });
  };

  const handleTaskComplete = (taskId: string, completed: boolean, columnId: string) => {
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
  };

  return {
    handleAddTask,
    handleEditTask,
    handleTaskSave,
    handleTaskDelete,
    handleTaskComplete
  };
}
