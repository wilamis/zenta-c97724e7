
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import FocusMode from "../components/focus/FocusMode";
import { Task } from "../components/tasks/TaskItem";
import { useLanguage } from "@/context/LanguageContext";
import { BrainCircuit } from "lucide-react";

const Focus = () => {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage or use sample data
    const savedTasks = localStorage.getItem("zenta-tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("zenta-tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  const handleTaskComplete = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <BrainCircuit className="h-8 w-8 text-zenta-purple" />
            {t("focus.title")}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {t("focus.subtitle")}
          </p>
        </header>
        
        <FocusMode 
          tasks={tasks.filter(task => !task.completed)} 
          onTaskComplete={handleTaskComplete}
        />
      </div>
    </Layout>
  );
};

export default Focus;
