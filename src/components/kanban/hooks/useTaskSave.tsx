
import { Task } from "@/components/tasks/TaskItem";
import { KanbanColumn } from "@/hooks/useKanbanBoard";
import { updateTasksInLists } from "@/utils/taskStorageUtils";

interface UseTaskSaveProps {
  columns: KanbanColumn[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
  activeColumn: string | null;
  editingTask: Task | null;
  toast: any;
}

export function useTaskSave({
  columns,
  setColumns,
  activeColumn,
  editingTask,
  toast
}: UseTaskSaveProps) {
  
  const handleTaskSave = (task: Task) => {
    if (!activeColumn) return;
    
    let updatedColumns = [...columns];
    const columnIndex = updatedColumns.findIndex(col => col.id === activeColumn);
    
    if (columnIndex === -1) return;
    
    const currentListId = localStorage.getItem("current-list-id") || "default";
    
    // Add listId to task if not present
    const taskWithListId = {
      ...task,
      listId: task.listId || currentListId
    };
    
    if (editingTask) {
      // Edit existing task
      updatedColumns[columnIndex].tasks = updatedColumns[columnIndex].tasks.map(t => 
        t.id === taskWithListId.id ? taskWithListId : t
      );
    } else {
      // Add new task with generated ID
      const newTask = {
        ...taskWithListId,
        id: Date.now().toString()
      };
      updatedColumns[columnIndex].tasks = [...updatedColumns[columnIndex].tasks, newTask];
    }
    
    setColumns(updatedColumns);
    
    // Update list data
    updateTasksInLists(updatedColumns, taskWithListId.listId);
    
    toast({
      title: editingTask ? "Tarefa atualizada" : "Tarefa adicionada",
      description: editingTask 
        ? "Sua tarefa foi atualizada com sucesso"
        : "Nova tarefa foi adicionada ao quadro",
    });
  };

  return {
    handleTaskSave
  };
}
