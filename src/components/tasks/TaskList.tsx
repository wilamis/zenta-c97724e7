
import { useState } from "react";
import { Button } from "../ui/button";
import TaskItem, { Task } from "./TaskItem";
import TaskModal from "./TaskModal";
import { Plus, Tag } from "lucide-react";
import CategoryManager from "./CategoryManager";
import { Category, defaultCategories } from "./categories/types";
import { useLanguage } from "@/context/LanguageContext";

interface TaskListProps {
  tasks: Task[];
  title: string;
  onTaskChange: (updatedTasks: Task[]) => void;
  emptyStateMessage?: string;
  completedCount?: number;
  totalCount?: number;
}

const TaskList = ({ 
  tasks, 
  title, 
  onTaskChange, 
  emptyStateMessage,
  completedCount,
  totalCount
}: TaskListProps) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [categories, setCategories] = useState<Category[]>([...defaultCategories]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSave = (task: Task) => {
    let updatedTasks: Task[];
    
    if (editingTask) {
      updatedTasks = tasks.map(t => t.id === task.id ? task : t);
    } else {
      const newTask = {
        ...task,
        id: Date.now().toString()
      };
      updatedTasks = [...tasks, newTask];
    }
    
    onTaskChange(updatedTasks);
    setIsModalOpen(false);
  };

  const handleTaskComplete = (id: string, completed: boolean) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    );
    onTaskChange(updatedTasks);
  };

  const handleTaskDelete = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    onTaskChange(updatedTasks);
  };

  const handleManageCategories = () => {
    setIsCategoryManagerOpen(true);
  };

  const handleCategoriesChange = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {t("tasks.backlog")}
          </h2>
          {(completedCount !== undefined && totalCount !== undefined) && (
            <div className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} done
              <div className="w-full h-1 bg-muted mt-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zenta-purple transition-all duration-500 ease-out"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleManageCategories}
          >
            <Tag className="w-4 h-4" />
            <span className="tracking-normal">{t("tasks.categories")}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleAddTask}
          >
            <Plus className="w-4 h-4" />
            <span className="tracking-normal">{t("tasks.addTask")}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {emptyStateMessage}
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={handleTaskComplete}
              onDelete={handleTaskDelete}
              onEdit={handleEditTask}
              categories={categories}
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleTaskSave}
          task={editingTask || undefined}
          categories={categories}
        />
      )}

      {isCategoryManagerOpen && (
        <CategoryManager
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
          categories={categories}
          onCategoriesChange={handleCategoriesChange}
        />
      )}
    </div>
  );
};

export default TaskList;
