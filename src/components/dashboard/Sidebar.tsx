
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Timer } from "lucide-react";
import StatsCard from "./StatsCard";
import DashboardProgress from "./DashboardProgress";
import Reminders from "./Reminders";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarProps {
  focusMinutes: number;
  completedPomodoros: number;
  completedTasks: number;
  totalTasks: number;
}

const Sidebar = ({ focusMinutes, completedPomodoros, completedTasks, totalTasks }: SidebarProps) => {
  const { t } = useLanguage();
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4">
        <StatsCard 
          title={t("dashboard.focusTime")} 
          value={`${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`}
          description={t("dashboard.todaysFocusedWork")}
          icon={<Clock className="h-5 w-5 text-zenta-purple" />}
        />
        
        <StatsCard 
          title={t("dashboard.pomodoros")} 
          value={completedPomodoros.toString()}
          description={t("dashboard.completedSessions")}
          icon={<Timer className="h-5 w-5 text-zenta-purple" />}
        />
        
        <StatsCard 
          title={t("dashboard.taskCompletion")} 
          value={`${completedTasks}/${totalTasks}`}
          progress={completionPercentage}
          description={`${completionPercentage}%`}
        />
      </div>
      
      {/* Progress section */}
      <Card className="glass-morphism border-zenta-purple/20">
        <CardContent className="pt-6">
          <DashboardProgress 
            level={3}
            currentXP={55}
            maxXP={100}
          />
        </CardContent>
      </Card>
      
      {/* Reminders */}
      <Reminders />
    </div>
  );
};

export default Sidebar;
