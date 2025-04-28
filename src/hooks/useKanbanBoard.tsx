
import { useState, useEffect } from "react";
import { Task } from "@/components/tasks/TaskItem";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  // Get the list ID from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const listId = searchParams.get('list') || localStorage.getItem("current-list-id") || "default";
    
    // Store the current list ID
    localStorage.setItem("current-list-id", listId);
    
    // Load columns for this specific list
    const savedColumns = localStorage.getItem(`kanban-columns-${listId}`);
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    } else {
      // Default columns with translated titles based on current language
      const defaultColumns: KanbanColumn[] = [
        { id: "backlog", title: "Pendentes", tasks: [] },
        { id: "this-week", title: "Esta Semana", tasks: [] },
        { id: "today", title: "Hoje", tasks: [] },
        { id: "done", title: "Concluído", tasks: [] },
      ];
      setColumns(defaultColumns);
      localStorage.setItem(`kanban-columns-${listId}`, JSON.stringify(defaultColumns));
    }
  }, [location.search]);

  // Save columns to localStorage whenever they change
  useEffect(() => {
    if (columns.length > 0) {
      const listId = localStorage.getItem("current-list-id") || "default";
      localStorage.setItem(`kanban-columns-${listId}`, JSON.stringify(columns));
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
