
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import TaskList from "../components/tasks/TaskList";
import TaskItem from "../components/tasks/TaskItem";
import { Task } from "../components/tasks/TaskItem.d";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CheckSquare, ListTodo, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Tasks = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("zenta-tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });
  
  const [deletedTasks, setDeletedTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("zenta-deleted-tasks");
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem("zenta-tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem("zenta-deleted-tasks", JSON.stringify(deletedTasks));
  }, [deletedTasks]);
  
  const handleTasksChange = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };
  
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const totalActiveTasks = activeTasks.length;
  const totalCompletedTasks = completedTasks.length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6 w-full max-w-[100%]">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">{t("tasks.title")}</h1>
          <p className="text-muted-foreground">
            {t("tasks.subtitle")}
          </p>
        </header>
        
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("tasks.activeTasks")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActiveTasks}</div>
              <p className="text-xs text-muted-foreground">
                {t("tasks.tasksToBeCompleted")}
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("tasks.completedTasks")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompletedTasks}</div>
              <p className="text-xs text-muted-foreground">
                {t("tasks.wellDone")}
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("tasks.completionRate")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {t("tasks.overallTaskCompletion")}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className={`${isMobile ? 'flex flex-wrap w-full' : ''}`}>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <ListTodo className="h-4 w-4" />
                {t("tasks.active")}
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                {t("tasks.completed")}
              </TabsTrigger>
              <TabsTrigger value="deleted" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                {t("tasks.deleted")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-6 mt-6">
              <Card className="glass-morphism border-zenta-purple/20">
                <CardContent className="pt-6">
                  <TaskList
                    title={t("tasks.activeTasks")}
                    tasks={activeTasks}
                    onTaskChange={handleTasksChange}
                    emptyStateMessage={t("tasks.noActiveTasks")}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6 mt-6">
              <Card className="glass-morphism border-zenta-purple/20">
                <CardContent className="pt-6">
                  <TaskList
                    title={t("tasks.completedTasks")}
                    tasks={completedTasks}
                    onTaskChange={handleTasksChange}
                    emptyStateMessage={t("tasks.noCompletedTasks")}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deleted" className="space-y-6 mt-6">
              <Card className="glass-morphism border-zenta-purple/20">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">
                        {t("tasks.deleted")}
                      </h2>
                    </div>
                    
                    {deletedTasks.length === 0 ? (
                      <div className="text-center py-8 space-y-2">
                        <p className="text-muted-foreground">{t("tasks.noDeletedTasks")}</p>
                        <p className="text-sm text-muted-foreground">{t("tasks.deletedTasksDescription")}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {deletedTasks.map(task => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onComplete={() => {}}
                            onDelete={() => {}}
                            onEdit={() => {}}
                          />
                        ))}
                      </div>
                    )}
                  </div>
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
