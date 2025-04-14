
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Task } from "../components/tasks/TaskItem";
import TaskList from "../components/tasks/TaskList";
import DashboardStats from "../components/dashboard/DashboardStats";
import { Badge } from "../components/ui/badge";
import { Bell, Calendar, ListTodo, PlayCircle, Timer, Zap } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
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
  const { language } = useLanguage();
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
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">{formattedDate}</p>
            <Badge variant="outline" className="ml-2 bg-zenta-purple text-white">
              {t("dashboard.level")} 3
            </Badge>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <Card className="glass-morphism border-zenta-purple/20 overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center">
                  <ListTodo className="h-5 w-5 text-zenta-purple mr-2" />
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
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-morphism border-zenta-purple/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold flex items-center">
                        <Timer className="h-4 w-4 mr-2 text-zenta-purple" />
                        {t("dashboard.pomodoro")}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {t("dashboard.pomodoroDescription")}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/pomodoro">{t("dashboard.startSession")}</a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism border-zenta-purple/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold flex items-center">
                        <PlayCircle className="h-4 w-4 mr-2 text-zenta-purple" />
                        {t("dashboard.focusMode")}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {t("dashboard.focusModeDescription")}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/focus">{t("dashboard.enterFocusMode")}</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="glass-morphism border-zenta-purple/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-zenta-orange" />
                      {t("dashboard.quickActions")}
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Button asChild>
                    <a href="/tasks">
                      <ListTodo className="h-4 w-4 mr-2" />
                      {t("dashboard.newTask")}
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/focus">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {t("dashboard.startFocus")}
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/planner">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t("dashboard.planWeek")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-5 space-y-6">
            <DashboardStats 
              tasks={tasks}
              focusMinutes={focusMinutes}
              completedPomodoros={completedPomodoros}
            />
            
            <Card className="glass-morphism border-zenta-purple/20">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 text-zenta-purple mr-2" />
                  {t("dashboard.reminders")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 pt-2">
                  <div className="bg-secondary rounded-lg p-3">
                    <div className="font-medium">{t("dashboard.teamMeeting")}</div>
                    <div className="text-sm text-muted-foreground">{t("dashboard.tomorrowAt")}</div>
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
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

export default Index;
