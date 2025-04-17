
import { Task } from "@/components/tasks/TaskItem";
import { KanbanColumn } from "@/hooks/useKanbanBoard";

/**
 * Updates tasks in lists storage based on the current kanban columns
 * @param updatedColumns - The current state of kanban columns
 * @param listId - The list ID to update
 */
export const updateTasksInLists = (updatedColumns: KanbanColumn[], listId: string) => {
  try {
    const savedLists = localStorage.getItem("task-lists");
    if (savedLists) {
      const lists = JSON.parse(savedLists);
      
      // Get all tasks from all columns
      const allTasks = updatedColumns.flatMap(col => col.tasks);
      
      const updatedLists = lists.map((list: any) => {
        if (list.id === listId) {
          // Filter tasks that belong to this list
          const listTasks = allTasks.filter(t => t.listId === listId);
          return {
            ...list,
            tasks: listTasks
          };
        }
        return list;
      });
      
      localStorage.setItem("task-lists", JSON.stringify(updatedLists));
      
      // Also update the tasks in general storage
      updateTasksInGeneralStorage(allTasks, listId);
    }
  } catch (e) {
    console.error("Error updating lists:", e);
  }
};

/**
 * Updates the general tasks storage
 * @param allTasks - All tasks from the kanban columns
 * @param listId - The list ID to update
 */
const updateTasksInGeneralStorage = (allTasks: Task[], listId: string) => {
  const tasksFromStorage = localStorage.getItem("zenta-tasks");
  if (tasksFromStorage) {
    try {
      const existingTasks = JSON.parse(tasksFromStorage);
      
      // Remove tasks associated with this list
      const filteredTasks = existingTasks.filter((t: Task) => t.listId !== listId);
      
      // Add updated tasks for this list
      const tasksForThisList = allTasks.filter(t => t.listId === listId);
      const updatedTasks = [...filteredTasks, ...tasksForThisList];
      
      localStorage.setItem("zenta-tasks", JSON.stringify(updatedTasks));
    } catch (e) {
      console.error("Error updating tasks storage:", e);
    }
  }
};
