
import { useState } from "react";
import { MoreVertical, Plus, Edit, Trash, Menu } from "lucide-react";
import { Task } from "../tasks/TaskItem";
import { Button } from "@/components/ui/button";
import { KanbanColumn as KanbanColumnType } from "./KanbanBoard";
import TaskItem from "../tasks/TaskItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RenameColumnDialog from "./RenameColumnDialog";

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
}: KanbanColumnProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  
  const handleRename = (newTitle: string) => {
    onRename(column.id, newTitle);
    setIsRenameOpen(false);
  };

  // Add highlight state for drop target indication
  const [isDropTarget, setIsDropTarget] = useState(false);

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

  return (
    <div 
      className={`kanban-column ${isDropTarget ? 'bg-secondary/50' : 'bg-secondary/30'} rounded-md p-4 w-80 flex-shrink-0 flex flex-col max-h-[70vh] transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg tracking-normal">{column.title}</h3>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                <span className="tracking-normal">Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive" 
                onClick={() => onDelete(column.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                <span className="tracking-normal">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="task-list space-y-2 overflow-y-auto flex-1">
        {column.tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tasks in this column
          </div>
        ) : (
          column.tasks.map(task => (
            <div 
              key={task.id}
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
      
      <div className="mt-4">
        <Button 
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => onAddTask(column.id)}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="tracking-normal">Add Task</span>
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
    </div>
  );
};

export default KanbanColumn;
