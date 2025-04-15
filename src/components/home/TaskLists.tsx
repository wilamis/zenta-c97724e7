
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ListTodo } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; 
import TaskList, { ListData } from "./TaskList";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { Task } from "@/components/tasks/TaskItem";

const TaskLists = () => {
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
  
  // Load all tasks from kanban board storage to ensure sync
  useEffect(() => {
    const kanbanColumns = localStorage.getItem("kanban-columns");
    if (kanbanColumns) {
      try {
        const columns = JSON.parse(kanbanColumns);
        const allTasks: Task[] = columns.flatMap((col: any) => col.tasks || []);
        
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
        }
      } catch (e) {
        console.error("Error synchronizing tasks:", e);
      }
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="h-6 w-6 text-zenta-purple" />
          <h2 className="text-2xl font-medium">{t('tasks.yourLists')}</h2>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>{t('tasks.createList')}</span>
        </Button>
      </div>
      
      {lists.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">{t('tasks.noLists')}</h3>
          <p className="text-muted-foreground mb-4">{t('tasks.createFirstList')}</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            {t('tasks.createFirstListButton')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lists.map(list => (
            <TaskList 
              key={list.id} 
              list={list} 
              onDelete={handleDeleteList}
              onRename={handleRenameList}
            />
          ))}
          
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="h-full min-h-[200px] border-dashed flex flex-col gap-4 items-center justify-center"
          >
            <Plus className="h-8 w-8" />
            <span>{t('tasks.createNewList')}</span>
          </Button>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tasks.newList')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="list-title">{t('tasks.listTitle')}</Label>
              <Input
                id="list-title"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder={t('tasks.listTitlePlaceholder')}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('taskModal.cancel')}
            </Button>
            <Button onClick={handleAddList} disabled={!newListTitle.trim()}>
              {t('tasks.createListButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskLists;
