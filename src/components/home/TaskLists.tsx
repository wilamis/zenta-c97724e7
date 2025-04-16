
import { Button } from "@/components/ui/button";
import { Plus, ListTodo } from "lucide-react";
import TaskList from "./TaskList";
import { useLanguage } from "@/context/LanguageContext";
import { useTaskLists } from "@/hooks/useTaskLists";
import CreateListDialog from "./CreateListDialog";
import EmptyListState from "./EmptyListState";
import AddListButton from "./AddListButton";

const TaskLists = () => {
  const { t } = useLanguage();
  const {
    lists,
    isDialogOpen,
    setIsDialogOpen,
    newListTitle,
    setNewListTitle,
    handleAddList,
    handleDeleteList,
    handleRenameList
  } = useTaskLists();
  
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
        <EmptyListState onCreateList={() => setIsDialogOpen(true)} />
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
          
          <AddListButton onClick={() => setIsDialogOpen(true)} />
        </div>
      )}
      
      <CreateListDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={newListTitle}
        onTitleChange={setNewListTitle}
        onSave={handleAddList}
      />
    </div>
  );
};

export default TaskLists;
