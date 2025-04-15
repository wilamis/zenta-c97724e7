
import { useState, useEffect } from "react";
import { Task } from "@/components/tasks/TaskItem";
import { useToast } from "@/hooks/use-toast";

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
}

export function useKanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [draggedTaskInfo, setDraggedTaskInfo] = useState<{taskId: string, sourceColumnId: string} | null>(null);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize with default columns if none exist
  useEffect(() => {
    const savedColumns = localStorage.getItem("kanban-columns");
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    } else {
      const defaultColumns: KanbanColumn[] = [
        { id: "backlog", title: "Pendentes", tasks: [] },
        { id: "this-week", title: "Esta Semana", tasks: [] },
        { id: "today", title: "Hoje", tasks: [] },
        { id: "done", title: "Concluído", tasks: [] },
      ];
      setColumns(defaultColumns);
      localStorage.setItem("kanban-columns", JSON.stringify(defaultColumns));
    }
  }, []);

  // Save columns to localStorage whenever they change
  useEffect(() => {
    if (columns.length > 0) {
      localStorage.setItem("kanban-columns", JSON.stringify(columns));
    }
  }, [columns]);

  return {
    columns,
    setColumns,
    isAddColumnOpen,
    setIsAddColumnOpen,
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    setEditingTask,
    activeColumn,
    setActiveColumn,
    draggedTaskInfo,
    setDraggedTaskInfo,
    draggedColumnId,
    setDraggedColumnId,
    toast
  };
}
