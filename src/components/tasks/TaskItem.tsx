
import { cn } from "@/lib/utils";
import { Clock, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "p" | "b" | "g" | null;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  estimatedTime?: number; // in minutes
  dueDate?: string;
  notes?: string;
}

interface TaskItemProps {
  task: Task;
  onComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem = ({ task, onComplete, onDelete, onEdit }: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div 
      className={cn(
        "task-card relative", 
        task.completed && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={(checked) => onComplete(task.id, checked as boolean)}
          className="mt-1 mr-3"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`priority-dot priority-${task.priority}`} />
            {task.category && <span className={`priority-dot priority-${task.category}`} />}
            <h3 className={cn(
              "text-base font-medium flex-1 truncate",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
          </div>
          
          {task.estimatedTime && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3 mr-1 inline" />
              {formatTime(task.estimatedTime)}
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex items-center space-x-1 transition-opacity", 
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
            onClick={() => onDelete(task.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
