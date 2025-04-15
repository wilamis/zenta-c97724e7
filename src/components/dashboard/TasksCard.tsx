
import { ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskList from "@/components/tasks/TaskList";
import { Task } from "@/components/tasks/TaskItem";
import { useLanguage } from "@/context/LanguageContext";

interface TasksCardProps {
  todayTasks: Task[];
  handleTasksChange: (updatedTasks: Task[]) => void;
  completedTasks: number;
  totalTasks: number;
}

const TasksCard = ({ todayTasks, handleTasksChange, completedTasks, totalTasks }: TasksCardProps) => {
  const { t } = useLanguage();
  
  return (
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
          totalCount={totalTasks}
        />
      </CardContent>
    </Card>
  );
};

export default TasksCard;
