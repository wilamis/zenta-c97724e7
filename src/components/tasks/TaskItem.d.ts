
export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "p" | "b" | "g" | null;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  estimatedTime: number;
  description?: string;
  dueDate?: string;
}
