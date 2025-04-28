
import { Task } from "@/components/tasks/TaskItem";
import TaskItem from "@/components/tasks/TaskItem";
import EmptyColumnState from "./EmptyColumnState";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTaskTouchInteractions } from "../hooks/useTaskTouchInteractions";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";

interface TasksListProps {
  tasks: Task[];
  columnId: string;
  onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onCompleteTask: (taskId: string, completed: boolean, columnId: string) => void;
}

const TasksList = ({
  tasks,
  columnId,
  onDragStart,
  onEditTask,
  onDeleteTask,
  onCompleteTask
}: TasksListProps) => {
  const isMobile = useIsMobile();
  const { setDraggedTaskInfo } = useKanbanBoard();
  
  const { 
    handleTouchStart, 
    handleTouchEnd, 
    handleTouchMove, 
    draggingTask 
  } = useTaskTouchInteractions({
    isMobile,
    onDragStart,
    columnId,
    setDraggedTaskInfo
  });
  
  return (
    <div className="task-list space-y-2 min-h-[100px]">
      {tasks.length === 0 ? (
        <EmptyColumnState />
      ) : (
        tasks.map(task => (
          <div 
            key={task.id}
            id={`task-${task.id}`}
            draggable={!isMobile}
            onDragStart={(e) => !isMobile && onDragStart(e, task.id, columnId)}
            onTouchStart={(e) => handleTouchStart(e, task.id)}
            onTouchEnd={(e) => handleTouchEnd(e, task.id)}
            onTouchMove={(e) => handleTouchMove(e, task.id)}
            className={`transition-transform ${
              draggingTask === task.id 
                ? "opacity-70 scale-105 z-50" 
                : !isMobile ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            <TaskItem
              task={task}
              onComplete={(id, completed) => onCompleteTask(id, completed, columnId)}
              onDelete={(id) => onDeleteTask(id, columnId)}
              onEdit={(task) => onEditTask(task)}
              isMobile={isMobile}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default TasksList;
