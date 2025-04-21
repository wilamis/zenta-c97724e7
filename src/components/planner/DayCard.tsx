
import { format, isToday } from "date-fns";
import { Task } from "../tasks/TaskItem";
import { CardTitle, CardHeader, CardContent, Card } from "../ui/card";
import TaskItem from "../tasks/TaskItem";
import { ScrollArea } from "../ui/scroll-area";
import { Locale } from "date-fns";

interface DayCardProps {
  day: Date;
  tasks: Task[];
  dateLocale: Locale;
  onAddTask: (date: Date) => void;
  onTaskComplete: (id: string, completed: boolean) => void;
  onTaskDelete: (id: string) => void;
  onEditTask: (task: Task) => void;
  t: (key: string) => string;
  formatWeekday: (date: Date) => string;
}

const DayCard = ({
  day,
  tasks,
  dateLocale,
  onAddTask,
  onTaskComplete,
  onTaskDelete,
  onEditTask,
  t,
  formatWeekday,
}: DayCardProps) => {
  const isCurrentDay = isToday(day);
  const dayName = formatWeekday(day);
  const dayNumber = format(day, "d");

  return (
    <Card 
      className={`${isCurrentDay ? "border-zenta-purple/50" : "border-border/50"} bg-background/50 backdrop-blur-sm h-[400px] flex flex-col`}
    >
      <CardHeader className="p-3 flex-none flex flex-row justify-between items-center">
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground capitalize">
            {dayName}
          </span>
          <CardTitle className={`text-xl ${isCurrentDay ? "text-zenta-purple" : ""}`}>
            {dayNumber}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={onTaskComplete}
                  onDelete={onTaskDelete}
                  onEdit={onEditTask}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-4">
              <p className="text-sm text-muted-foreground">
                {t("planner.noTasks")}
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DayCard;
