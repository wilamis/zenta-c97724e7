
import { Task } from "../tasks/TaskItem";
import { Card } from "@/components/ui/card";
import { KanbanColumn as KanbanColumnType } from "@/hooks/useKanbanBoard";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColumnHeader from "./components/ColumnHeader";
import AddTaskButton from "./components/AddTaskButton";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ClearColumnDialog from "./components/ClearColumnDialog";
import { useColumnActions } from "./hooks/useColumnActions";
import TasksList from "./components/TasksList";
import { useIsMobile } from "@/hooks/use-mobile";

interface KanbanColumnProps {
  column: KanbanColumnType;
  onRename: (id: string, title: string) => void;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task, columnId: string) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onCompleteTask: (taskId: string, completed: boolean, columnId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onColumnDragStart: (e: React.DragEvent, columnId: string) => void;
  onColumnDragOver: (e: React.DragEvent) => void;
  onColumnDrop: (e: React.DragEvent, columnId: string) => void;
  isDraggingColumn: boolean;
}

const KanbanColumn = ({
  column,
  onRename,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  isDraggingColumn
}: KanbanColumnProps) => {
  const isMobile = useIsMobile();
  
  const {
    isRenameOpen,
    setIsRenameOpen,
    isDropTarget,
    isColumnDropTarget,
    isClearDialogOpen,
    setIsClearDialogOpen,
    isClearing,
    handleDragOver: handleLocalDragOver,
    handleDragLeave,
    handleColumnDragOver: handleLocalColumnDragOver,
    handleColumnDragLeave,
    handleClearColumn
  } = useColumnActions({
    columnId: column.id,
    tasks: column.tasks,
    onDeleteTask
  });
  
  const handleDragOverWrapper = (e: React.DragEvent) => {
    if (isMobile) return;
    handleLocalDragOver(e);
    onDragOver(e);
  };
  
  const handleDropWrapper = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, column.id);
  };
  
  const handleColumnDragOverWrapper = (e: React.DragEvent) => {
    if (isMobile) return;
    if (isDraggingColumn) {
      handleLocalColumnDragOver(e);
      onColumnDragOver(e);
    }
  };
  
  const handleColumnDropWrapper = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDraggingColumn) {
      onColumnDrop(e, column.id);
    }
  };

  const handleAddTaskClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddTask(column.id);
  };

  // Calculate column width based on device
  const columnWidth = isMobile
    ? "w-[85vw] min-w-[250px] max-w-[300px]"  // Mobile: wider columns but not too wide
    : "w-[300px]";                            // Desktop: fixed width
  
  // Calculate column height based on device
  const columnContentHeight = isMobile
    ? "max-h-[450px] h-[70vh]"  // Mobile: shorter and responsive
    : "h-[630px]";              // Desktop: fixed height

  return <>
      <Card 
        className={cn(
          "kanban-column flex-shrink-0 flex flex-col", 
          columnWidth,
          isDropTarget ? 'bg-secondary/50 border-primary/40' : isColumnDropTarget ? 'bg-primary/20 border-primary/40' : 'bg-card', 
          "transition-all duration-200 hover:border-zenta-purple touch-pan-x touch-pan-y", 
          isDraggingColumn && !isMobile && "cursor-grabbing"
        )}
        id={`kanban-column-${column.id}`}
        data-column-id={column.id}
        onDragOver={isMobile ? undefined : (isDraggingColumn ? handleColumnDragOverWrapper : handleDragOverWrapper)} 
        onDragLeave={isMobile ? undefined : (isDraggingColumn ? handleColumnDragLeave : handleDragLeave)} 
        onDrop={isMobile ? handleDropWrapper : (isDraggingColumn ? handleColumnDropWrapper : handleDropWrapper)}
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <ColumnHeader 
          title={column.title} 
          onRenameClick={() => setIsRenameOpen(true)} 
          onClearClick={column.title === "Concluído" ? () => setIsClearDialogOpen(true) : undefined} 
          onDragStart={(e) => onColumnDragStart(e, column.id)} 
          isMobile={isMobile}
        />
        
        <ScrollArea className={`flex-1 p-2 overflow-y-auto scrollbar-hide ${columnContentHeight}`}>
          <TasksList 
            tasks={column.tasks} 
            columnId={column.id} 
            onDragStart={onDragStart} 
            onEditTask={task => onEditTask(task, column.id)} 
            onDeleteTask={onDeleteTask} 
            onCompleteTask={onCompleteTask} 
          />
        </ScrollArea>
        
        <div className="p-2 border-t flex justify-between items-center gap-2">
          {column.title === "Concluído" && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsClearDialogOpen(true)} 
              disabled={isClearing} 
              className="h-10 w-10 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-grow">
            <AddTaskButton onClick={handleAddTaskClick} />
          </div>
        </div>
      </Card>

      <ClearColumnDialog isOpen={isClearDialogOpen} onOpenChange={setIsClearDialogOpen} onClear={handleClearColumn} isClearing={isClearing} />
    </>;
};

export default KanbanColumn;
