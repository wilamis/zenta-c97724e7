
import { Task } from "@/components/tasks/TaskItem";
import { KanbanColumn } from "@/hooks/useKanbanBoard";

// Safely update localStorage with error handling
export const safelyUpdateStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error updating ${key} in localStorage:`, error);
    return false;
  }
};

// Extract all tasks from columns
export const getAllTasksFromColumns = (columns: KanbanColumn[]): Task[] => {
  return columns.flatMap(column => column.tasks || []);
};

// Update tasks in the lists data structure
export const updateTasksInLists = (columns: KanbanColumn[], listId?: string) => {
  if (!listId) return;
  
  try {
    // Get all tasks from columns
    const allTasks = getAllTasksFromColumns(columns);
    
    // Get existing lists
    const listsData = localStorage.getItem("task-lists");
    if (!listsData) return;
    
    const lists = JSON.parse(listsData);
    
    // Find the specific list and update its tasks
    const updatedLists = lists.map((list: any) => {
      if (list.id === listId) {
        // Filter tasks for this list only
        const listTasks = allTasks.filter(task => task.listId === listId);
        return { ...list, tasks: listTasks };
      }
      return list;
    });
    
    // Save updated lists back to storage
    safelyUpdateStorage("task-lists", updatedLists);
    
  } catch (error) {
    console.error("Error updating tasks in lists:", error);
  }
};

// Sync tasks between kanban board and tasks page
export const syncTasksWithTasksPage = (columns: KanbanColumn[]) => {
  try {
    const allTasks = getAllTasksFromColumns(columns);
    
    // Get existing tasks from tasks page
    const tasksData = localStorage.getItem("zenta-tasks") || "[]";
    const existingTasks = JSON.parse(tasksData);
    
    // Create a map of existing task IDs
    const existingTaskIds = new Set(existingTasks.map((t: Task) => t.id));
    
    // Get new tasks from kanban
    const newTasks = allTasks.filter(task => !existingTaskIds.has(task.id));
    
    // Update existing tasks
    const updatedExistingTasks = existingTasks.map((task: Task) => {
      const updatedTask = allTasks.find(t => t.id === task.id);
      return updatedTask || task;
    });
    
    // Combine tasks
    const combinedTasks = [...updatedExistingTasks, ...newTasks];
    
    // Save back to storage
    safelyUpdateStorage("zenta-tasks", combinedTasks);
    
  } catch (error) {
    console.error("Error syncing tasks:", error);
  }
};
