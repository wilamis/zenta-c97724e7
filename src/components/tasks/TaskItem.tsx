import { cn } from "@/lib/utils";
import { Clock, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Category, defaultCategories } from "./categories/types";
import { Task, TaskCategory, TaskPriority } from "./TaskItem.d";

// Re-export the types so they can be imported from this file
export type { Task, TaskCategory, TaskPriority };

interface TaskItemProps {
  task: Task;
  onComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  categories?: Category[];
  isDeleted?: boolean;
  isMobile?: boolean;
}

const TaskItem = ({ 
  task, 
  onComplete, 
  onDelete, 
  onEdit,
  categories = defaultCategories,
  isDeleted = false,
  isMobile = false
}: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Format estimated time as "1hr 30min" or "30min"
  const formatTime = (minutes?: number) => {
    if (!minutes) return "00:00";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}hr${mins > 0 ? ` ${mins}min` : ''}`;
    }
    
    return `${mins}min`;
  };

  const getCategoryColor = (code: TaskCategory) => {
    if (!code) return "";
    const category = categories.find(cat => cat.code === code);
    return category ? category.color : "";
  };

  const getCategoryName = (code: TaskCategory) => {
    if (!code) return "";
    const category = categories.find(cat => cat.code === code);
    return category ? category.name : "";
  };

  const toggleActions = (e: React.MouseEvent) => {
    if (isMobile) {
      e.stopPropagation(); // Prevent event bubbling
      setShowActions(!showActions);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    onComplete(task.id, checked);
    // Mobile: hide actions after completion
    if (isMobile && showActions) {
      setShowActions(false);
    }
  };

  const handleTaskClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
    if (isMobile && showActions) {
      setShowActions(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
    if (isMobile) setShowActions(false);
  };

  return (
    <div 
      className={cn(
        "task-card relative p-2 border border-border rounded-md bg-card cursor-pointer", 
        task.completed && "opacity-60",
        isDeleted && "opacity-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTaskClick}
    >
      <div className="flex items-start">
        {!isDeleted && (
          <Checkbox 
            checked={task.completed}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') {
                handleCheckboxChange(checked);
              }
            }}
            className="mt-1 mr-3 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
        {isDeleted && (
          <div className="w-5 h-5 mr-3 mt-1 flex items-center justify-center flex-shrink-0">
            <Trash className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`priority-dot priority-${task.priority} flex-shrink-0`} />
            {task.category && (
              <span 
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  getCategoryColor(task.category)
                )}
                title={getCategoryName(task.category)}
              />
            )}
            <h3 className={cn(
              "text-base font-medium truncate flex-1",
              (task.completed || isDeleted) && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
          </div>
          
          {task.estimatedTime > 0 && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3 mr-1 inline flex-shrink-0" />
              {formatTime(task.estimatedTime)}
            </div>
          )}
          
          {task.deletedAt && (
            <div className="text-xs text-muted-foreground mt-1">
              Deleted on: {new Date(task.deletedAt).toLocaleDateString()}
            </div>
          )}
        </div>
        
        {!isDeleted && (
          <div className={cn(
            "flex items-center transition-opacity flex-shrink-0", 
            isMobile 
              ? (showActions ? "opacity-100" : "opacity-0 pointer-events-none")
              : (isHovered ? "opacity-100" : "opacity-0")
          )}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
              onClick={handleDeleteClick}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
