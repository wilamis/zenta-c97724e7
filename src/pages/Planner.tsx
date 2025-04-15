
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import TaskPlanner from "../components/planner/TaskPlanner";
import { Task } from "../components/tasks/TaskItem";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar } from "lucide-react";

const Planner = () => {
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
  
  const handleTasksChange = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <header className="flex items-center gap-2 mb-6">
          <Calendar className="h-7 w-7 text-zenta-purple" />
          <h1 className="text-3xl font-bold">{t("planner.title")}</h1>
        </header>
        <TaskPlanner tasks={tasks} onTaskChange={handleTasksChange} />
      </div>
    </Layout>
  );
};

export default Planner;
