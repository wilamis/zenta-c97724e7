
import { useState, useEffect } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import KanbanColumn from "./KanbanColumn";
import AddColumnDialog from "./AddColumnDialog";
import { Task } from "../tasks/TaskItem";
import TaskModal from "../tasks/TaskModal";

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [draggedTaskInfo, setDraggedTaskInfo] = useState<{taskId: string, sourceColumnId: string} | null>(null);
  const { toast } = useToast();

  // Initialize with default columns if none exist
  useEffect(() => {
    const savedColumns = localStorage.getItem("kanban-columns");
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    } else {
      const defaultColumns: KanbanColumn[] = [
        { id: "todo", title: "To Do", tasks: [] },
        { id: "in-progress", title: "In Progress", tasks: [] },
        { id: "done", title: "Done", tasks: [] },
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

  const handleAddColumn = (title: string) => {
    const newColumn: KanbanColumn = {
      id: Date.now().toString(),
      title,
      tasks: [],
    };
    
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    setIsAddColumnOpen(false);
    
    toast({
      title: "Column added",
      description: `${title} column has been added to the board`,
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    const updatedColumns = columns.filter(column => column.id !== columnId);
    setColumns(updatedColumns);
    
    toast({
      title: "Column deleted",
      description: "The column has been removed from the board",
    });
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    const updatedColumns = columns.map(column => 
      column.id === columnId ? { ...column, title: newTitle } : column
    );
    setColumns(updatedColumns);
    
    toast({
      title: "Column renamed",
      description: `Column renamed to ${newTitle}`,
    });
  };

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
    setIsTaskModalOpen(false);
    setActiveColumn(null);
    
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

  const handleDragStart = (e: React.DragEvent, taskId: string, columnId: string) => {
    // Store task and source column information in state for better reliability
    setDraggedTaskInfo({ taskId, sourceColumnId: columnId });
    
    // Set data on the drag event for compatibility
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", columnId);
    
    // Set drag image and effects
    if (e.dataTransfer.setDragImage) {
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        e.dataTransfer.setDragImage(element, 20, 20);
      }
    }
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    // Try to get data from draggedTaskInfo state first (more reliable)
    let taskId = draggedTaskInfo?.taskId;
    let sourceColumnId = draggedTaskInfo?.sourceColumnId;
    
    // Fall back to dataTransfer if state isn't available
    if (!taskId) {
      taskId = e.dataTransfer.getData("taskId");
    }
    
    if (!sourceColumnId) {
      sourceColumnId = e.dataTransfer.getData("sourceColumnId");
    }
    
    // Clear dragged task info
    setDraggedTaskInfo(null);
    
    // Validation
    if (!taskId || !sourceColumnId || sourceColumnId === targetColumnId) {
      return;
    }
    
    // Find the task in the source column
    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    if (!sourceColumn) return;
    
    const task = sourceColumn.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    console.log("Moving task:", task.title, "from", sourceColumnId, "to", targetColumnId);
    
    // Create a new array of columns to avoid mutation
    const updatedColumns = columns.map(column => {
      // Remove from source column
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter(t => t.id !== taskId)
        };
      }
      // Add to target column
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, task]
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    
    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (targetColumn) {
      toast({
        title: "Task moved",
        description: `Task moved to ${targetColumn.title}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Manage Columns</h2>
        <Button 
          onClick={() => setIsAddColumnOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span className="tracking-normal">Add Column</span>
        </Button>
      </div>
      
      <div className="kanban-board flex gap-6 overflow-x-auto pb-6 pt-2 min-h-[70vh]">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            onRename={handleRenameColumn}
            onDelete={handleDeleteColumn}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleTaskDelete}
            onCompleteTask={handleTaskComplete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
      
      {isAddColumnOpen && (
        <AddColumnDialog
          isOpen={isAddColumnOpen}
          onClose={() => setIsAddColumnOpen(false)}
          onAddColumn={handleAddColumn}
        />
      )}
      
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleTaskSave}
          task={editingTask || undefined}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
