
import { Task } from "../tasks/TaskItem";
import DayCard from "./DayCard";
import { Locale } from "date-fns";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface DaysGridProps {
  days: Date[];
  tasks: Task[];
  dateLocale: Locale;
  onAddTask: (date: Date) => void;
  onTaskComplete: (id: string, completed: boolean) => void;
  onTaskDelete: (id: string) => void;
  onEditTask: (task: Task) => void;
  t: (key: string) => string;
  formatWeekday: (date: Date) => string;
  getDayTasks: (date: Date) => Task[];
  isMobile: boolean;
}

const DaysGrid = ({
  days,
  tasks,
  dateLocale,
  onAddTask,
  onTaskComplete,
  onTaskDelete,
  onEditTask,
  t,
  formatWeekday,
  getDayTasks,
  isMobile,
}: DaysGridProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-muted-foreground">{days.length} dias</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-zenta-purple border-zenta-purple/50 hover:bg-zenta-purple/10" 
          onClick={() => onAddTask(days[0])}
        >
          <Plus className="h-4 w-4 mr-1" />
          {t("planner.addTask")}
        </Button>
      </div>
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {days.map((day, i) => (
          <DayCard
            key={i}
            day={day}
            tasks={getDayTasks(day)}
            dateLocale={dateLocale}
            onAddTask={onAddTask}
            onTaskComplete={onTaskComplete}
            onTaskDelete={onTaskDelete}
            onEditTask={onEditTask}
            t={t}
            formatWeekday={formatWeekday}
          />
        ))}
      </div>
    </div>
  );
};

export default DaysGrid;
