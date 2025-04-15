
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Task } from "../components/tasks/TaskItem";
import TaskList from "../components/tasks/TaskList";
import DashboardStats from "../components/dashboard/DashboardStats";
import { Badge } from "../components/ui/badge";
import { Bell, Calendar, Clock, ListTodo, PlayCircle, Timer, Zap } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Index = () => {
  const { t, language } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage or use sample data
    const savedTasks = localStorage.getItem("zenta-tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    
    // Sample tasks
    return [
      {
        id: "1",
        title: "Create project plan",
        completed: false,
        priority: "high",
        category: "b",
        estimatedTime: 60
      },
      {
        id: "2",
        title: "Research competitors",
        completed: false,
        priority: "medium",
        category: "b",
        estimatedTime: 45
      },
      {
        id: "3",
        title: "Update portfolio",
        completed: true,
        priority: "low",
        category: "p",
        estimatedTime: 30
      },
      {
        id: "4",
        title: "Learn React hooks",
        completed: false,
        priority: "medium",
        category: "g",
        estimatedTime: 90
      },
      {
        id: "5",
        title: "Weekly team meeting",
        completed: false,
        priority: "high",
        category: "b",
        estimatedTime: 60
      }
    ];
  });
  
  const [focusMinutes, setFocusMinutes] = useState<number>(() => {
    const savedMinutes = localStorage.getItem("zenta-focus-minutes");
    return savedMinutes ? parseInt(savedMinutes) : 125;
  });
  
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    const savedPomodoros = localStorage.getItem("zenta-completed-pomodoros");
    return savedPomodoros ? parseInt(savedPomodoros) : 3;
  });
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("zenta-tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  const handleTasksChange = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };
  
  // Get today's date formatted based on current language
  const formattedDate = new Date().toLocaleDateString(language === "pt-BR" ? "pt-BR" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  
  // Filter tasks for today (those that are not completed)
  const todayTasks = tasks.filter(task => !task.completed);
  
  // Count completed tasks
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <Layout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
            <p className="text-muted-foreground">{formattedDate}</p>
          </div>
          <Badge variant="outline" className="bg-zenta-purple text-white px-3 py-1 text-sm">
            {t("dashboard.level")} 3
          </Badge>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Focus card */}
            <Card className="glass-morphism border-zenta-purple/20 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-zenta-purple" />
                  {t("dashboard.todaysTasks")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TaskList
                  title=""
                  tasks={todayTasks}
                  onTaskChange={handleTasksChange}
                  emptyStateMessage={t("dashboard.noTasksForToday")}
                  completedCount={completedTasks}
                  totalCount={tasks.length}
                />
              </CardContent>
            </Card>
            
            {/* Focus & Pomodoro quick access */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-morphism border-zenta-purple/20 hover:border-zenta-purple/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Timer className="h-10 w-10 text-zenta-purple mb-2" />
                    <h3 className="font-medium">{t("dashboard.pomodoro")}</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      {t("dashboard.pomodoroDescription")}
                    </p>
                    <Button className="mt-auto w-full" asChild>
                      <a href="/pomodoro">{t("dashboard.startSession")}</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism border-zenta-purple/20 hover:border-zenta-purple/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <PlayCircle className="h-10 w-10 text-zenta-purple mb-2" />
                    <h3 className="font-medium">{t("dashboard.focusMode")}</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      {t("dashboard.focusModeDescription")}
                    </p>
                    <Button className="mt-auto w-full" asChild>
                      <a href="/focus">{t("dashboard.enterFocusMode")}</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <Card className="glass-morphism border-zenta-purple/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-zenta-orange" />
                  {t("dashboard.quickActions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start h-12 border-zenta-purple/20 hover:border-zenta-purple/50" asChild>
                  <a href="/tasks">
                    <ListTodo className="h-4 w-4 mr-2" />
                    {t("dashboard.newTask")}
                  </a>
                </Button>
                <Button variant="outline" className="justify-start h-12 border-zenta-purple/20 hover:border-zenta-purple/50" asChild>
                  <a href="/focus">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    {t("dashboard.startFocus")}
                  </a>
                </Button>
                <Button variant="outline" className="justify-start h-12 border-zenta-purple/20 hover:border-zenta-purple/50" asChild>
                  <a href="/planner">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t("dashboard.planWeek")}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar/stats area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-4">
              <StatsCard 
                title={t("dashboard.focusTime")} 
                value={`${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`}
                description={t("dashboard.todaysFocusedWork")}
                icon={<Clock className="h-5 w-5 text-zenta-purple" />}
              />
              
              <StatsCard 
                title={t("dashboard.pomodoros")} 
                value={completedPomodoros.toString()}
                description={t("dashboard.completedSessions")}
                icon={<Timer className="h-5 w-5 text-zenta-purple" />}
              />
              
              <StatsCard 
                title={t("dashboard.taskCompletion")} 
                value={`${completedTasks}/${tasks.length}`}
                progress={tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}
                description={`${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%`}
              />
            </div>
            
            {/* Progress section */}
            <Card className="glass-morphism border-zenta-purple/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {t("dashboard.yourProgress")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardProgress 
                  level={3}
                  currentXP={55}
                  maxXP={100}
                />
              </CardContent>
            </Card>
            
            {/* Reminders */}
            <Card className="glass-morphism border-zenta-purple/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-zenta-purple" />
                  {t("dashboard.reminders")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-secondary/30 rounded-lg p-3 border border-secondary/50">
                    <div className="font-medium">{t("dashboard.teamMeeting")}</div>
                    <div className="text-sm text-muted-foreground">{t("dashboard.tomorrowAt")}</div>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3 border border-secondary/50">
                    <div className="font-medium">{t("dashboard.projectDeadline")}</div>
                    <div className="text-sm text-muted-foreground">{t("dashboard.fridayAt")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  progress?: number;
}

const StatsCard = ({ title, value, description, icon, progress }: StatsCardProps) => {
  return (
    <Card className="glass-morphism border-zenta-purple/20">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          {icon && <div>{icon}</div>}
        </div>
        {progress !== undefined && (
          <div className="w-full h-1 bg-muted mt-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-zenta-purple transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardProgressProps {
  level: number;
  currentXP: number;
  maxXP: number;
}

const DashboardProgress = ({ level, currentXP, maxXP }: DashboardProgressProps) => {
  const progress = (currentXP / maxXP) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-zenta-purple rounded-full flex items-center justify-center text-white font-bold">
          {level}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-medium">Level {level}</div>
            <div className="text-sm text-muted-foreground">
              {currentXP}/{maxXP} XP
            </div>
          </div>
          <div className="w-full h-2 bg-muted mt-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-zenta-purple transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
