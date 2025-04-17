
import { Task } from "@/components/tasks/TaskItem";
import TaskItem from "@/components/tasks/TaskItem";
import EmptyColumnState from "./EmptyColumnState";

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
  return (
    <div className="task-list space-y-2 min-h-[100px]">
      {tasks.length === 0 ? (
        <EmptyColumnState />
      ) : (
        tasks.map(task => (
          <div 
            key={task.id}
            id={`task-${task.id}`}
            draggable="true"
            onDragStart={(e) => onDragStart(e, task.id, columnId)}
            className="cursor-grab active:cursor-grabbing"
          >
            <TaskItem
              task={task}
              onComplete={(id, completed) => onCompleteTask(id, completed, columnId)}
              onDelete={(id) => onDeleteTask(id, columnId)}
              onEdit={(task) => onEditTask(task)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default TasksList;
