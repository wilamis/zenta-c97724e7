
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import TaskPlanner from "../components/planner/TaskPlanner";
import { Task } from "../components/tasks/TaskItem";
import { useLanguage } from "@/context/LanguageContext";

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
      <TaskPlanner tasks={tasks} onTaskChange={handleTasksChange} />
    </Layout>
  );
};

export default Planner;
