
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

interface TaskCountInfo {
  pendingTasks: Task[];
  totalTime: number;
}

const TaskList = ({ list, onDelete, onRename }: TaskListProps) => {
  const { t } = useLanguage();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  
  // Extract task counting logic to a separate function
  const getTaskCountInfo = (tasks: Task[]): TaskCountInfo => {
    const pendingTasks = Array.isArray(tasks) ? tasks.filter(task => !task.completed) : [];
    const totalTime = pendingTasks.reduce((acc, task) => acc + (task.estimatedTime || 0), 0);
    
    return { pendingTasks, totalTime };
  };
  
  const { pendingTasks, totalTime } = getTaskCountInfo(list.tasks);
  
  console.log("List tasks:", list.id, list.title, list.tasks?.length, pendingTasks.length);
  
  const handleRenameStart = () => {
    setIsRenaming(true);
  };
  
  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(list.id, newTitle);
      setIsRenaming(false);
    }
  };
  
  const handleDeleteList = () => {
    onDelete(list.id);
  };
  
  return (
    <Card className="glass-morphism border-zenta-purple/20 hover:border-zenta-purple/50 transition-all duration-300 h-full">
      <CardContent className="p-0">
        <ListHeader 
          isRenaming={isRenaming}
          title={list.title}
          newTitle={newTitle}
          totalTime={totalTime}
          onRename={handleRename}
          onRenameStart={handleRenameStart}
          onDelete={handleDeleteList}
          setNewTitle={setNewTitle}
        />
        
        <TasksContainer pendingTasks={pendingTasks} t={t} />
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

// Extract list header to a separate component
interface ListHeaderProps {
  isRenaming: boolean;
  title: string;
  newTitle: string;
  totalTime: number;
  onRename: () => void;
  onRenameStart: () => void;
  onDelete: () => void;
  setNewTitle: (title: string) => void;
}

const ListHeader = ({ 
  isRenaming, 
  title, 
  newTitle, 
  totalTime, 
  onRename, 
  onRenameStart, 
  onDelete, 
  setNewTitle 
}: ListHeaderProps) => {
  return (
    <div className="p-4 flex items-center justify-between">
      {isRenaming ? (
        <RenameInput 
          newTitle={newTitle} 
          setNewTitle={setNewTitle} 
          onRename={onRename} 
        />
      ) : (
        <TitleDisplay 
          title={title} 
          totalTime={totalTime} 
          onRenameStart={onRenameStart} 
          onDelete={onDelete} 
        />
      )}
    </div>
  );
};

// Extract rename input to a separate component
interface RenameInputProps {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onRename: () => void;
}

const RenameInput = ({ newTitle, setNewTitle, onRename }: RenameInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onRename();
    }
  };
  
  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        autoFocus
        onBlur={onRename}
        onKeyDown={handleKeyDown}
      />
      <Button size="sm" variant="default" onClick={onRename}>OK</Button>
    </div>
  );
};

// Extract title display to a separate component
interface TitleDisplayProps {
  title: string;
  totalTime: number;
  onRenameStart: () => void;
  onDelete: () => void;
}

const TitleDisplay = ({ title, totalTime, onRenameStart, onDelete }: TitleDisplayProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <h3 className="font-medium">{title}</h3>
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
            <DropdownMenuItem onClick={onRenameStart}>
              {t('tasks.rename')}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              {t('tasks.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

// Extract tasks container to a separate component
interface TasksContainerProps {
  pendingTasks: Task[];
  t: (key: string) => string;
}

const TasksContainer = ({ pendingTasks, t }: TasksContainerProps) => {
  return (
    <div className="px-50 py-2 space-y-2 max-h-[200px] overflow-y-auto">
      {pendingTasks.length > 0 ? (
        <>
          <TaskItemsList pendingTasks={pendingTasks} />
          {pendingTasks.length > 4 && (
            <MoreTasksIndicator count={pendingTasks.length - 4} t={t} />
          )}
        </>
      ) : (
        <EmptyTasksMessage t={t} />
      )}
    </div>
  );
};

// Rename component to avoid redeclaration
interface TaskItemsListProps {
  pendingTasks: Task[];
}

const TaskItemsList = ({ pendingTasks }: TaskItemsListProps) => {
  return (
    <>
      {pendingTasks.slice(0, 4).map((task, idx) => (
        <TaskItem key={task.id} task={task} idx={idx} />
      ))}
    </>
  );
};

// Extract task item to a separate component
interface TaskItemProps {
  task: Task;
  idx: number;
}

const TaskItem = ({ task, idx }: TaskItemProps) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
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
  );
};

// Extract more tasks indicator to a separate component
interface MoreTasksIndicatorProps {
  count: number;
  t: (key: string) => string;
}

const MoreTasksIndicator = ({ count, t }: MoreTasksIndicatorProps) => {
  return (
    <div className="text-center text-xs text-muted-foreground pt-2">
      + {count} {t('tasks.moreTasks')}
    </div>
  );
};

// Extract empty tasks message to a separate component
interface EmptyTasksMessageProps {
  t: (key: string) => string;
}

const EmptyTasksMessage = ({ t }: EmptyTasksMessageProps) => {
  return (
    <div className="text-center py-4 text-muted-foreground text-sm">
      {t('tasks.noTasksInList')}
    </div>
  );
};

export default TaskList;
