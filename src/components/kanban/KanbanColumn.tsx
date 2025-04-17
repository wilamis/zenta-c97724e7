import { useState } from "react";
import { Task } from "../tasks/TaskItem";
import { Card } from "@/components/ui/card";
import { KanbanColumn as KanbanColumnType } from "@/hooks/useKanbanBoard";
import TaskItem from "../tasks/TaskItem";
import RenameColumnDialog from "./RenameColumnDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColumnHeader from "./components/ColumnHeader";
import EmptyColumnState from "./components/EmptyColumnState";
import AddTaskButton from "./components/AddTaskButton";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

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
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [isColumnDropTarget, setIsColumnDropTarget] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const { t } = useLanguage();
  
  const handleRename = (newTitle: string) => {
    onRename(column.id, newTitle);
    setIsRenameOpen(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(true);
    onDragOver(e);
  };

  const handleDragLeave = () => {
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);
    onDrop(e, column.id);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDraggingColumn) {
      setIsColumnDropTarget(true);
      onColumnDragOver(e);
    }
  };

  const handleColumnDragLeave = () => {
    setIsColumnDropTarget(false);
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsColumnDropTarget(false);
    if (isDraggingColumn) {
      onColumnDrop(e, column.id);
    }
  };

  const handleClearColumn = () => {
    column.tasks.forEach(task => {
      onDeleteTask(task.id, column.id);
    });
    setIsClearDialogOpen(false);
  };

  return (
    <>
      <Card 
        className={`kanban-column w-[320px] flex-shrink-0 flex flex-col ${
          isDropTarget ? 'bg-secondary/50 border-primary/40' : 
          isColumnDropTarget ? 'bg-primary/20 border-primary/40' : 
          'bg-card'
        } transition-colors duration-200 hover:border-zenta-purple ${isDraggingColumn ? 'cursor-grabbing' : ''}`}
        onDragOver={isDraggingColumn ? handleColumnDragOver : handleDragOver}
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
          <div className="task-list space-y-2 min-h-[100px]">
            {column.tasks.length === 0 ? (
              <EmptyColumnState />
            ) : (
              column.tasks.map(task => (
                <div 
                  key={task.id}
                  id={`task-${task.id}`}
                  draggable="true"
                  onDragStart={(e) => onDragStart(e, task.id, column.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TaskItem
                    task={task}
                    onComplete={(id, completed) => onCompleteTask(id, completed, column.id)}
                    onDelete={(id) => onDeleteTask(id, column.id)}
                    onEdit={(task) => onEditTask(task, column.id)}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="p-2 border-t flex justify-end items-center gap-2">
          {column.title === "Concluído" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => setIsClearDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <AddTaskButton onClick={() => onAddTask(column.id)} />
        </div>
        
        {isRenameOpen && (
          <RenameColumnDialog
            isOpen={isRenameOpen}
            onClose={() => setIsRenameOpen(false)}
            onRename={handleRename}
            currentTitle={column.title}
          />
        )}
      </Card>

      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('kanban.clearColumn')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('kanban.clearColumnDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('kanban.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearColumn}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('kanban.clearColumnAction')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default KanbanColumn;
