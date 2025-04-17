
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

interface KanbanColumnProps {
  column: KanbanColumnType;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
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
  onDelete,
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
  isDraggingColumn,
}: KanbanColumnProps) => {
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
    handleLocalDragOver(e);
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, column.id);
  };

  const handleColumnDragOverWrapper = (e: React.DragEvent) => {
    if (isDraggingColumn) {
      handleLocalColumnDragOver(e);
      onColumnDragOver(e);
    }
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDraggingColumn) {
      onColumnDrop(e, column.id);
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "kanban-column w-[320px] flex-shrink-0 flex flex-col",
          isDropTarget ? 'bg-secondary/50 border-primary/40' : 
          isColumnDropTarget ? 'bg-primary/20 border-primary/40' : 
          'bg-card',
          "transition-colors duration-200 hover:border-zenta-purple",
          isDraggingColumn && "cursor-grabbing"
        )}
        onDragOver={isDraggingColumn ? handleColumnDragOverWrapper : handleDragOverWrapper}
        onDragLeave={isDraggingColumn ? handleColumnDragLeave : handleDragLeave}
        onDrop={isDraggingColumn ? handleColumnDrop : handleDrop}
      >
        <ColumnHeader
          title={column.title}
          onRenameClick={() => setIsRenameOpen(true)}
          onDeleteClick={() => onDelete(column.id)}
          onClearClick={column.title === "Concluído" ? () => setIsClearDialogOpen(true) : undefined}
          onDragStart={(e) => onColumnDragStart(e, column.id)}
        />
        
        <ScrollArea className="flex-1 p-2 h-[630px] overflow-y-auto scrollbar-hide">
          <TasksList
            tasks={column.tasks}
            columnId={column.id}
            onDragStart={onDragStart}
            onEditTask={(task) => onEditTask(task, column.id)}
            onDeleteTask={onDeleteTask}
            onCompleteTask={onCompleteTask}
          />
        </ScrollArea>
        
        <div className="p-2 border-t flex justify-end items-center gap-2">
          {column.title === "Concluído" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => setIsClearDialogOpen(true)}
              disabled={isClearing}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <AddTaskButton onClick={() => onAddTask(column.id)} />
        </div>
      </Card>

      <ClearColumnDialog
        isOpen={isClearDialogOpen}
        onOpenChange={setIsClearDialogOpen}
        onClear={handleClearColumn}
        isClearing={isClearing}
      />
    </>
  );
};

export default KanbanColumn;
