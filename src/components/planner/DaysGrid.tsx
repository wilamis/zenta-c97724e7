
import { Task } from "../tasks/TaskItem";
import DayCard from "./DayCard";
import { Locale } from "date-fns";

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
  );
};

export default DaysGrid;
