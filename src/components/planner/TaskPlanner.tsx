
import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Task } from "../tasks/TaskItem";
import { Button } from "../ui/button";
import TaskModal from "../tasks/TaskModal";
import { useLanguage } from "@/context/LanguageContext";
import { ptBR, enUS } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import DaysGrid from "./DaysGrid";

interface TaskPlannerProps {
  tasks: Task[];
  onTaskChange: (updatedTasks: Task[]) => void;
}

const TaskPlanner = ({ tasks, onTaskChange }: TaskPlannerProps) => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return startOfWeek(today, { weekStartsOn: 1 });
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const dateLocale = language === "pt-BR" ? ptBR : enUS;
  
  const goToPreviousWeek = () => {
    setStartDate(prevDate => addDays(prevDate, -7));
  };
  
  const goToNextWeek = () => {
    setStartDate(prevDate => addDays(prevDate, 7));
  };
  
  const goToCurrentWeek = () => {
    const today = new Date();
    setStartDate(startOfWeek(today, { weekStartsOn: 1 }));
  };
  
  const getDayTasks = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return tasks.filter(task => task.dueDate === dateString);
  };
  
  const handleAddTask = (date: Date) => {
    setSelectedDay(date);
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
        id: Date.now().toString(),
        dueDate: selectedDay ? format(selectedDay, "yyyy-MM-dd") : undefined
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
  
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startDate, i)
  );
  
  const formatWeekday = (date: Date) => {
    return isMobile 
      ? format(date, "E", { locale: dateLocale })
      : format(date, "EEEE", { locale: dateLocale });
  };

  const firstRowDays = weekDays.slice(0, 4);
  const secondRowDays = weekDays.slice(4);

  return (
    <div className="space-y-6 w-full max-w-[100%]">
      <div className={`${isMobile ? 'flex flex-col space-y-3' : 'flex items-center justify-between'}`}>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-zenta-purple" />
            {format(startDate, "MMMM d", { locale: dateLocale })} - {format(addDays(startDate, 6), "MMMM d, yyyy", { locale: dateLocale })}
          </h2>
          <p className="text-muted-foreground mt-1">{t("planner.subtitle")}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSelectedDay(new Date());
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="mr-2 bg-zenta-purple text-white hover:bg-zenta-purple/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t("planner.addTask")}
          </Button>
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            {t("planner.today")}
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-8">
        <DaysGrid
          days={firstRowDays}
          tasks={tasks}
          dateLocale={dateLocale}
          onAddTask={handleAddTask}
          onTaskComplete={handleTaskComplete}
          onTaskDelete={handleTaskDelete}
          onEditTask={handleEditTask}
          t={t}
          formatWeekday={formatWeekday}
          getDayTasks={getDayTasks}
          isMobile={isMobile}
        />
        
        <DaysGrid
          days={secondRowDays}
          tasks={tasks}
          dateLocale={dateLocale}
          onAddTask={handleAddTask}
          onTaskComplete={handleTaskComplete}
          onTaskDelete={handleTaskDelete}
          onEditTask={handleEditTask}
          t={t}
          formatWeekday={formatWeekday}
          getDayTasks={getDayTasks}
          isMobile={isMobile}
        />
      </div>
      
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleTaskSave}
          task={editingTask || undefined}
        />
      )}
    </div>
  );
};

export default TaskPlanner;
