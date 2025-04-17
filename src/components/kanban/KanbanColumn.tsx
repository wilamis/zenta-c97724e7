
import { useState } from "react";
import { MoreVertical, Plus, Edit, Trash, Menu } from "lucide-react";
import { Task } from "../tasks/TaskItem";
import { Button } from "@/components/ui/button";
import { KanbanColumn as KanbanColumnType } from "@/hooks/useKanbanBoard";
import TaskItem from "../tasks/TaskItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RenameColumnDialog from "./RenameColumnDialog";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  // New column drag props
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
  const { t } = useLanguage();
  
  const handleRename = (newTitle: string) => {
    onRename(column.id, newTitle);
    setIsRenameOpen(false);
  };

  // Add highlight state for drop target indication
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [isColumnDropTarget, setIsColumnDropTarget] = useState(false);

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

  // Column drag handlers
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

  return (
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
      <div 
        className="flex items-center justify-between p-3 border-b cursor-grab active:cursor-grabbing"
        draggable="true"
        onDragStart={(e) => onColumnDragStart(e, column.id)}
      >
        <div className="flex items-center gap-2">
          <Menu className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-base tracking-normal truncate">{column.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                <span className="tracking-normal">{t('kanban.editColumn')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive" 
                onClick={() => onDelete(column.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                <span className="tracking-normal">{t('kanban.deleteColumn')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2 h-[630px] overflow-y-auto scrollbar-hide">
        <div className="task-list space-y-2 min-h-[100px]">
          {column.tasks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              {t('kanban.noTasks')}
            </div>
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
      
      <div className="mt-auto p-2 border-t">
        <Button 
          variant="ghost"
          className="w-full justify-start text-muted-foreground text-sm h-8"
          onClick={() => onAddTask(column.id)}
        >
          <Plus className="h-4 w-4 mr-1" />
          <span className="tracking-normal">{t('tasks.addTask')}</span>
        </Button>
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
  );
};

export default KanbanColumn;
