
import { Task } from "@/components/tasks/TaskItem";

interface TasksContainerProps {
  pendingTasks: Task[];
  t: (key: string) => string;
}

export const TasksContainer = ({ pendingTasks, t }: TasksContainerProps) => {
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

// Task items list component
interface TaskItemsListProps {
  pendingTasks: Task[];
}

export const TaskItemsList = ({ pendingTasks }: TaskItemsListProps) => {
  return (
    <>
      {pendingTasks.slice(0, 4).map((task, idx) => (
        <TaskItem key={task.id} task={task} idx={idx} />
      ))}
    </>
  );
};

// Task item component
interface TaskItemProps {
  task: Task;
  idx: number;
}

export const TaskItem = ({ task, idx }: TaskItemProps) => {
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

// More tasks indicator component
interface MoreTasksIndicatorProps {
  count: number;
  t: (key: string) => string;
}

export const MoreTasksIndicator = ({ count, t }: MoreTasksIndicatorProps) => {
  return (
    <div className="text-center text-xs text-muted-foreground pt-2">
      + {count} {t('tasks.moreTasks')}
    </div>
  );
};

// Empty tasks message component
interface EmptyTasksMessageProps {
  t: (key: string) => string;
}

export const EmptyTasksMessage = ({ t }: EmptyTasksMessageProps) => {
  return (
    <div className="text-center py-4 text-muted-foreground text-sm">
      {t('tasks.noTasksInList')}
    </div>
  );
};

import { Badge } from "@/components/ui/badge";
