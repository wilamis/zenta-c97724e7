
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import TaskList from "../components/tasks/TaskList";
import { Task } from "../components/tasks/TaskItem";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CheckSquare, ListTodo } from "lucide-react";

const Tasks = () => {
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
  
  // Filter tasks
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // Calculate counts and stats
  const totalActiveTasks = activeTasks.length;
  const totalCompletedTasks = completedTasks.length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Organize, prioritize, and complete your tasks
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActiveTasks}</div>
              <p className="text-xs text-muted-foreground">
                Tasks to be completed
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompletedTasks}</div>
              <p className="text-xs text-muted-foreground">
                Well done!
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Overall task completion
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <ListTodo className="h-4 w-4" />
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Completed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-6 mt-6">
              <Card className="glass-morphism border-zenta-purple/20">
                <CardContent className="pt-6">
                  <TaskList
                    title="Active Tasks"
                    tasks={activeTasks}
                    onTaskChange={handleTasksChange}
                    emptyStateMessage="No active tasks. Add a new task to get started!"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6 mt-6">
              <Card className="glass-morphism border-zenta-purple/20">
                <CardContent className="pt-6">
                  <TaskList
                    title="Completed Tasks"
                    tasks={completedTasks}
                    onTaskChange={handleTasksChange}
                    emptyStateMessage="No completed tasks yet. Start completing tasks to see them here!"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
