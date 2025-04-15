
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Task } from "../components/tasks/TaskItem";
import { useLanguage } from "../context/LanguageContext";

// Import our new components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TasksCard from "../components/dashboard/TasksCard";
import FocusCard from "../components/dashboard/FocusCard";
import PomodoroCard from "../components/dashboard/PomodoroCard";
import QuickActions from "../components/dashboard/QuickActions";
import Sidebar from "../components/dashboard/Sidebar";

const Index = () => {
  const { language } = useLanguage();
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
        <DashboardHeader formattedDate={formattedDate} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Tasks card */}
            <TasksCard 
              todayTasks={todayTasks} 
              handleTasksChange={handleTasksChange}
              completedTasks={completedTasks}
              totalTasks={tasks.length}
            />
            
            {/* Focus & Pomodoro quick access */}
            <div className="grid grid-cols-2 gap-4">
              <FocusCard />
              <PomodoroCard />
            </div>
            
            {/* Quick Actions */}
            <QuickActions />
          </div>
          
          {/* Sidebar/stats area */}
          <div className="lg:col-span-4">
            <Sidebar 
              focusMinutes={focusMinutes}
              completedPomodoros={completedPomodoros}
              completedTasks={completedTasks}
              totalTasks={tasks.length}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
