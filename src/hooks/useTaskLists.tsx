
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ListData } from "@/components/home/lists/ListData";
import { Task } from "@/components/tasks/TaskItem";
import { useLanguage } from "@/context/LanguageContext";

export function useTaskLists() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [lists, setLists] = useState<ListData[]>(() => {
    const savedLists = localStorage.getItem("task-lists");
    if (savedLists) {
      try {
        const parsedLists = JSON.parse(savedLists);
        
        // Ensure each list has a tasks array
        return parsedLists.map((list: any) => ({
          ...list,
          tasks: Array.isArray(list.tasks) ? list.tasks : []
        }));
      } catch (e) {
        console.error("Error parsing task lists:", e);
        return [
          {
            id: "default",
            title: t('tasks.defaultList'),
            tasks: []
          }
        ];
      }
    }
    
    // Default list
    return [
      {
        id: "default",
        title: t('tasks.defaultList'),
        tasks: []
      }
    ];
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  
  // Load all tasks from localStorage and kanban board storage to ensure sync
  useEffect(() => {
    // First try to get all tasks from the tasks page
    const tasksFromStorage = localStorage.getItem("zenta-tasks");
    let allTasks: Task[] = [];
    
    if (tasksFromStorage) {
      try {
        const parsedTasks = JSON.parse(tasksFromStorage);
        if (Array.isArray(parsedTasks)) {
          allTasks = [...parsedTasks];
        }
      } catch (e) {
        console.error("Error parsing tasks:", e);
      }
    }
    
    // Then get tasks from kanban board
    const kanbanColumns = localStorage.getItem("kanban-columns");
    if (kanbanColumns) {
      try {
        const columns = JSON.parse(kanbanColumns);
        const kanbanTasks: Task[] = columns.flatMap((col: any) => col.tasks || []);
        // Merge tasks, avoiding duplicates by ID
        const existingIds = new Set(allTasks.map(t => t.id));
        kanbanTasks.forEach(task => {
          if (!existingIds.has(task.id)) {
            allTasks.push(task);
          }
        });
      } catch (e) {
        console.error("Error synchronizing tasks:", e);
      }
    }
    
    // Update lists with their associated tasks
    if (allTasks.length > 0) {
      const listsWithTasks = lists.map(list => {
        // Find tasks for this list
        const listTasks = allTasks.filter(task => task.listId === list.id);
        return {
          ...list,
          tasks: listTasks
        };
      });
      
      setLists(listsWithTasks);
      
      // Also update localStorage to ensure consistency
      localStorage.setItem("task-lists", JSON.stringify(listsWithTasks));
    }
  }, []);
  
  // Save lists to localStorage whenever they change
  const saveLists = (updatedLists: ListData[]) => {
    setLists(updatedLists);
    localStorage.setItem("task-lists", JSON.stringify(updatedLists));
  };
  
  const handleAddList = () => {
    if (!newListTitle.trim()) return;
    
    const newList: ListData = {
      id: Date.now().toString(),
      title: newListTitle,
      tasks: []
    };
    
    const updatedLists = [...lists, newList];
    saveLists(updatedLists);
    setNewListTitle("");
    setIsDialogOpen(false);
    
    toast({
      title: t('tasks.listCreated'),
      description: `${newListTitle} ${t('tasks.wasCreated')}`,
    });
  };
  
  const handleDeleteList = (id: string) => {
    const updatedLists = lists.filter(list => list.id !== id);
    saveLists(updatedLists);
    
    toast({
      title: t('tasks.listDeleted'),
      description: t('tasks.listDeletedDescription'),
    });
  };
  
  const handleRenameList = (id: string, newTitle: string) => {
    const updatedLists = lists.map(list => 
      list.id === id ? { ...list, title: newTitle } : list
    );
    saveLists(updatedLists);
    
    toast({
      title: t('tasks.listRenamed'),
      description: `${t('tasks.listRenamedTo')} ${newTitle}`,
    });
  };

  return {
    lists,
    isDialogOpen,
    setIsDialogOpen,
    newListTitle,
    setNewListTitle,
    handleAddList,
    handleDeleteList,
    handleRenameList
  };
}
