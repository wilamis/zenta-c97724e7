
import { KanbanColumn } from "@/hooks/useKanbanBoard";

interface UseKanbanColumnsProps {
  columns: KanbanColumn[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
  toast: any;
}

export function useKanbanColumns({ columns, setColumns, toast }: UseKanbanColumnsProps) {
  const handleAddColumn = (title: string) => {
    const newColumn: KanbanColumn = {
      id: Date.now().toString(),
      title,
      tasks: [],
    };
    
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    
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

  // Column drag handlers
  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData("columnId", columnId);
    e.dataTransfer.effectAllowed = "move";
    return columnId;
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string, draggedColumnId: string | null) => {
    e.preventDefault();
    
    // Get the dragged column ID
    const sourceColumnId = draggedColumnId || e.dataTransfer.getData("columnId");
    
    // Validation
    if (!sourceColumnId || sourceColumnId === targetColumnId) {
      return;
    }
    
    // Find the indices of the source and target columns
    const sourceIndex = columns.findIndex(col => col.id === sourceColumnId);
    const targetIndex = columns.findIndex(col => col.id === targetColumnId);
    
    if (sourceIndex === -1 || targetIndex === -1) {
      return;
    }
    
    // Create a new array with the columns in the new order
    const updatedColumns = [...columns];
    const [movedColumn] = updatedColumns.splice(sourceIndex, 1);
    updatedColumns.splice(targetIndex, 0, movedColumn);
    
    setColumns(updatedColumns);
    
    toast({
      title: "Column moved",
      description: `Column "${movedColumn.title}" has been repositioned`,
    });
  };

  return {
    handleAddColumn,
    handleDeleteColumn,
    handleRenameColumn,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop
  };
}
