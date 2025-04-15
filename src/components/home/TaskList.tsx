
import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreHorizontal, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { Task } from "@/components/tasks/TaskItem";

export interface ListData {
  id: string;
  title: string;
  tasks: Task[];
}

interface TaskListProps {
  list: ListData;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

const TaskList = ({ list, onDelete, onRename }: TaskListProps) => {
  const { t } = useLanguage();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  
  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(list.id, newTitle);
      setIsRenaming(false);
    }
  };

  // Make sure we're properly filtering and counting tasks
  const pendingTasks = Array.isArray(list.tasks) ? list.tasks.filter(task => !task.completed) : [];
  const totalTime = pendingTasks.reduce((acc, task) => acc + (task.estimatedTime || 0), 0);
  
  return (
    <Card className="glass-morphism border-zenta-purple/20 hover:border-zenta-purple/50 transition-all duration-300 h-full">
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-between">
          {isRenaming ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                autoFocus
                onBlur={handleRename}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              />
              <Button size="sm" variant="default" onClick={handleRename}>OK</Button>
            </div>
          ) : (
            <>
              <h3 className="font-medium">{list.title}</h3>
              <div className="flex items-center gap-2">
                {totalTime > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {totalTime} min
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsRenaming(true)}>
                      {t('tasks.rename')}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(list.id)}>
                      {t('tasks.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
        
        <div className="px-4 py-2 space-y-2 max-h-[200px] overflow-y-auto">
          {pendingTasks.length > 0 ? (
            pendingTasks.slice(0, 4).map((task, idx) => (
              <div key={task.id} className="flex items-center gap-2 p-2 rounded-md bg-background/50">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-muted text-xs">
                  {idx + 1}
                </div>
                <span className="text-sm truncate">{task.title}</span>
                {task.estimatedTime > 0 && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    {task.estimatedTime} min
                  </Badge>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              {t('tasks.noTasksInList')}
            </div>
          )}
          
          {pendingTasks.length > 4 && (
            <div className="text-center text-xs text-muted-foreground pt-2">
              + {pendingTasks.length - 4} {t('tasks.moreTasks')}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 border-t">
        <Badge variant="outline">
          {pendingTasks.length} {t('tasks.pendingTasks')}
        </Badge>
        <Button asChild variant="default" size="sm">
          <Link to={`/kanban?list=${list.id}`}>
            {t('tasks.viewTasks')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskList;
