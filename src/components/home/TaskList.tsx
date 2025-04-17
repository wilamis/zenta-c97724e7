
import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Task } from "@/components/tasks/TaskItem";

import { ListHeader, RenameInput, TitleDisplay } from './lists/TaskListHeader';
import { TasksContainer } from './lists/TasksContainer';
import { ListData } from './lists/ListData';
import { getTaskCountInfo } from './lists/TaskCountInfo';

interface TaskListProps {
  list: ListData;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

const TaskList = ({ list, onDelete, onRename }: TaskListProps) => {
  const { t } = useLanguage();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  
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

export default TaskList;
