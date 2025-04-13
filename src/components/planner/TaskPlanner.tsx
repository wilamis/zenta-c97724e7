
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Task } from "../tasks/TaskItem";
import { CalendarDays, ChevronLeft, ChevronRight, ListTodo, Plus } from "lucide-react";
import TaskList from "../tasks/TaskList";
import { cn } from "@/lib/utils";

interface TaskPlannerProps {
  tasks: Task[];
  onTaskChange: (updatedTasks: Task[]) => void;
}

const TaskPlanner = ({ tasks, onTaskChange }: TaskPlannerProps) => {
  const [activeTab, setActiveTab] = useState("today");
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Format date as "Monday, April 13"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };
  
  // Get day number (1-31)
  const getDayNumber = (date: Date) => {
    return date.getDate();
  };
  
  // Get day name (Mon, Tue, etc.)
  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };
  
  // Get week dates (for week view)
  const getWeekDates = () => {
    const dates = [];
    
    // Get the first day of the week (Sunday)
    const firstDayOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    
    // Set to previous Sunday
    firstDayOfWeek.setDate(currentDate.getDate() - day);
    
    // Get 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  // Navigate to previous day/week
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (activeTab === "today") {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };
  
  // Navigate to next day/week
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (activeTab === "today") {
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };
  
  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.filter(task => {
      if (task.dueDate) {
        return task.dueDate.startsWith(dateStr);
      }
      return false;
    });
  };
  
  // Get tasks for today
  const todayTasks = tasks.filter(task => !task.completed);
  
  // Get tasks for backlog (tasks without due date)
  const backlogTasks = tasks.filter(task => !task.dueDate && !task.completed);
  
  // Get weekly tasks
  const weekDates = getWeekDates();
  
  // Calculate total estimated time
  const calculateEstimatedTime = (taskList: Task[]) => {
    return taskList.reduce((total, task) => total + (task.estimatedTime || 0), 0);
  };
  
  // Format time as "1hr 30min"
  const formatEstimatedTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}hr${mins > 0 ? ` ${mins}min` : ''}`;
    }
    
    return `${mins}min`;
  };
  
  // Count completed tasks
  const countCompletedTasks = (taskList: Task[]) => {
    return taskList.filter(task => task.completed).length;
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="today" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Task Planner</h1>
            <p className="text-muted-foreground">
              Schedule and organize your tasks efficiently
            </p>
          </div>
          
          <TabsList className="h-10">
            <TabsTrigger value="today" className="gap-2">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Today</span>
            </TabsTrigger>
            <TabsTrigger value="week" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Week</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="today" className="mt-0">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <h2 className="text-xl font-semibold">
              {formatDate(currentDate)}
            </h2>
            
            <Button variant="ghost" size="icon" onClick={goToNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-morphism border-zenta-purple/20">
              <CardContent className="pt-6">
                <TaskList
                  title="Today"
                  tasks={todayTasks}
                  onTaskChange={onTaskChange}
                  emptyStateMessage="No tasks scheduled for today"
                  completedCount={countCompletedTasks(todayTasks)}
                  totalCount={todayTasks.length}
                />
              </CardContent>
            </Card>
            
            <Card className="glass-morphism border-zenta-purple/20">
              <CardContent className="pt-6">
                <TaskList
                  title="Backlog"
                  tasks={backlogTasks}
                  onTaskChange={onTaskChange}
                  emptyStateMessage="No tasks in backlog"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="week" className="mt-0">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <h2 className="text-xl font-semibold">
              Week of {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </h2>
            
            <Button variant="ghost" size="icon" onClick={goToNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {weekDates.map((date, index) => {
              const isToday = new Date().toDateString() === date.toDateString();
              
              return (
                <div 
                  key={index} 
                  className={cn(
                    "text-center p-2 rounded-lg",
                    isToday && "bg-secondary"
                  )}
                >
                  <div className="text-sm text-muted-foreground">
                    {getDayName(date)}
                  </div>
                  <div className={cn(
                    "text-xl font-bold",
                    isToday && "text-zenta-purple"
                  )}>
                    {getDayNumber(date)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {weekDates.map((date, index) => {
              const dayTasks = getTasksForDate(date);
              const isToday = new Date().toDateString() === date.toDateString();
              
              if (dayTasks.length === 0) return null;
              
              return (
                <Card 
                  key={index} 
                  className={cn(
                    "glass-morphism border-border",
                    isToday && "border-zenta-purple/50"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">
                        {formatDate(date)}
                      </h3>
                      {dayTasks.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Est: {formatEstimatedTime(calculateEstimatedTime(dayTasks))}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {dayTasks.map(task => (
                        <div 
                          key={task.id}
                          className={cn(
                            "task-card !my-0",
                            task.completed && "opacity-60"
                          )}
                        >
                          <div className="flex items-center">
                            <span className={`priority-dot priority-${task.priority}`} />
                            {task.category && <span className={`priority-dot priority-${task.category}`} />}
                            <h3 className={cn(
                              "text-base font-medium flex-1",
                              task.completed && "line-through text-muted-foreground"
                            )}>
                              {task.title}
                            </h3>
                            {task.estimatedTime && (
                              <div className="text-xs text-muted-foreground">
                                {formatEstimatedTime(task.estimatedTime)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <Button variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Task to Schedule
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskPlanner;
