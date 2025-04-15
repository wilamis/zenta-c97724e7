import { useState } from "react";
import { format, addDays, startOfWeek, getDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Task } from "../tasks/TaskItem";
import { Button } from "../ui/button";
import { CardTitle, CardHeader, CardContent, Card } from "../ui/card";
import TaskModal from "../tasks/TaskModal";
import TaskItem from "../tasks/TaskItem";
import { useLanguage } from "@/context/LanguageContext";
import { ptBR, enUS } from "date-fns/locale";

interface TaskPlannerProps {
  tasks: Task[];
  onTaskChange: (updatedTasks: Task[]) => void;
}

const TaskPlanner = ({ tasks, onTaskChange }: TaskPlannerProps) => {
  const { t, language } = useLanguage();
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
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
    // Get task due on this date
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
      // Editing existing task
      updatedTasks = tasks.map(t => t.id === task.id ? task : t);
    } else {
      // Creating new task with selected date
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
  
  // Generate array of dates for this week
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startDate, i)
  );
  
  // Format weekday name based on the locale
  const formatWeekday = (date: Date) => {
    return format(date, "EEEE", { locale: dateLocale });
  };

  return (
    <div className="space-y-6">
      {/* Planner header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-zenta-purple" />
            {t("planner.weeklyPlanner")}
          </h1>
          <p className="text-muted-foreground">
            {format(startDate, "MMMM d", { locale: dateLocale })} - {format(addDays(startDate, 6), "MMMM d, yyyy", { locale: dateLocale })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
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
      
      {/* Weekly calendar */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, i) => {
          const dayTasks = getDayTasks(day);
          const isToday = format(new Date(), "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
          const dayName = formatWeekday(day);
          const dayNumber = format(day, "d");
          
          return (
            <Card 
              key={i} 
              className={`glass-morphism ${isToday ? "border-zenta-purple" : "border-zenta-purple/20"}`}
            >
              <CardHeader className="p-3 pb-0">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground capitalize">
                    {dayName}
                  </span>
                  <CardTitle className={`text-xl ${isToday ? "text-zenta-purple" : ""}`}>
                    {dayNumber}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 h-[180px] overflow-y-auto">
                {dayTasks.length > 0 ? (
                  <div className="space-y-1">
                    {dayTasks.map(task => (
                      <div key={task.id} className="task-card text-xs p-2 my-1">
                        <TaskItem
                          task={task}
                          onComplete={handleTaskComplete}
                          onDelete={handleTaskDelete}
                          onEdit={handleEditTask}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      {t("planner.noTasks")}
                    </p>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAddTask(day)}>
                      <Plus className="h-3 w-3 mr-1" />
                      {t("planner.addTask")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
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
