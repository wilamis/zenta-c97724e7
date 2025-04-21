import { useState } from "react";
import { format, addDays, startOfWeek, isToday } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Task } from "../tasks/TaskItem";
import { Button } from "../ui/button";
import { CardTitle, CardHeader, CardContent, Card } from "../ui/card";
import TaskModal from "../tasks/TaskModal";
import TaskItem from "../tasks/TaskItem";
import { useLanguage } from "@/context/LanguageContext";
import { ptBR, enUS } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "../ui/scroll-area";

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
      <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex items-center justify-between'}`}>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-zenta-purple" />
            {format(startDate, "MMMM d", { locale: dateLocale })} - {format(addDays(startDate, 6), "MMMM d, yyyy", { locale: dateLocale })}
          </h2>
          <p className="text-muted-foreground mt-1">{t("planner.subtitle")}</p>
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
      
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {firstRowDays.map((day, i) => {
          const dayTasks = getDayTasks(day);
          const isCurrentDay = isToday(day);
          const dayName = formatWeekday(day);
          const dayNumber = format(day, "d");
          
          return (
            <Card 
              key={i} 
              className={`${isCurrentDay ? "border-zenta-purple/50" : "border-border/50"} bg-background/50 backdrop-blur-sm min-h-[350px]`}
            >
              <CardHeader className="p-3 pb-0">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground capitalize">
                    {dayName}
                  </span>
                  <CardTitle className={`text-xl ${isCurrentDay ? "text-zenta-purple" : ""}`}>
                    {dayNumber}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <ScrollArea className="h-[280px] pr-2">
                  {dayTasks.length > 0 ? (
                    <div className="space-y-2">
                      {dayTasks.map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onComplete={handleTaskComplete}
                          onDelete={handleTaskDelete}
                          onEdit={handleEditTask}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <p className="text-xs text-muted-foreground mb-2">
                        {t("planner.noTasks")}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => handleAddTask(day)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {t("planner.addTask")}
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {secondRowDays.map((day, i) => {
          const dayTasks = getDayTasks(day);
          const isCurrentDay = isToday(day);
          const dayName = formatWeekday(day);
          const dayNumber = format(day, "d");
          
          return (
            <Card 
              key={i} 
              className={`${isCurrentDay ? "border-zenta-purple/50" : "border-border/50"} bg-background/50 backdrop-blur-sm min-h-[350px]`}
            >
              <CardHeader className="p-3 pb-0">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground capitalize">
                    {dayName}
                  </span>
                  <CardTitle className={`text-xl ${isCurrentDay ? "text-zenta-purple" : ""}`}>
                    {dayNumber}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <ScrollArea className="h-[280px] pr-2">
                  {dayTasks.length > 0 ? (
                    <div className="space-y-2">
                      {dayTasks.map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onComplete={handleTaskComplete}
                          onDelete={handleTaskDelete}
                          onEdit={handleEditTask}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <p className="text-xs text-muted-foreground mb-2">
                        {t("planner.noTasks")}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => handleAddTask(day)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {t("planner.addTask")}
                      </Button>
                    </div>
                  )}
                </ScrollArea>
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
