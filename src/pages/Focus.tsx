
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import FocusMode from "../components/focus/FocusMode";
import { Task } from "../components/tasks/TaskItem";
import { useLanguage } from "@/context/LanguageContext";

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
      <FocusMode 
        tasks={tasks.filter(task => !task.completed)} 
        onTaskComplete={handleTaskComplete}
      />
    </Layout>
  );
};

export default Focus;
