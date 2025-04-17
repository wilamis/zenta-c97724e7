
import { Task } from "@/components/tasks/TaskItem";

export interface TaskCountInfo {
  pendingTasks: Task[];
  totalTime: number;
}

export const getTaskCountInfo = (tasks: Task[]): TaskCountInfo => {
  const pendingTasks = Array.isArray(tasks) ? tasks.filter(task => !task.completed) : [];
  const totalTime = pendingTasks.reduce((acc, task) => acc + (task.estimatedTime || 0), 0);
  
  return { pendingTasks, totalTime };
};
