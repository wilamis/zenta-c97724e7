
import { Task } from "@/components/tasks/TaskItem";
import { KanbanColumn } from "@/hooks/useKanbanBoard";
import { useTaskOperations } from "./hooks/useTaskOperations";
import { useTaskSave } from "./hooks/useTaskSave";

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

export function useKanbanTasks(props: UseKanbanTasksProps) {
  const { 
    columns, 
    setColumns, 
    setActiveColumn, 
    setEditingTask, 
    setIsTaskModalOpen,
    toast,
    activeColumn,
    editingTask
  } = props;

  // Initialize task operations
  const {
    handleAddTask,
    handleEditTask,
    handleTaskDelete,
    handleTaskComplete
  } = useTaskOperations({
    columns,
    setColumns,
    setActiveColumn,
    setEditingTask,
    setIsTaskModalOpen,
    toast
  });

  // Initialize task save operation
  const { handleTaskSave } = useTaskSave({
    columns,
    setColumns,
    activeColumn,
    editingTask,
    toast
  });

  return {
    handleAddTask,
    handleEditTask,
    handleTaskSave,
    handleTaskDelete,
    handleTaskComplete
  };
}
