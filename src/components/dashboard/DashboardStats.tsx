
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Clock, FlameIcon, Star, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "../tasks/TaskItem";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardStatsProps {
  tasks: Task[];
  focusMinutes: number;
  completedPomodoros: number;
}

const DashboardStats = ({ tasks, focusMinutes, completedPomodoros }: DashboardStatsProps) => {
  const { t } = useLanguage();
  
  // Calculate task completion rate
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate XP and level
  const tasksXP = completedTasks * 10;
  const focusXP = Math.floor(focusMinutes / 15) * 5;
  const pomodoroXP = completedPomodoros * 15;
  const totalXP = tasksXP + focusXP + pomodoroXP;
  
  const level = Math.floor(totalXP / 100) + 1;
  const xpForNextLevel = level * 100;
  const currentLevelXP = totalXP % 100;
  const xpProgress = (currentLevelXP / 100) * 100;
  
  // Streaks
  const currentStreak = 5; // This would come from actual data
  const longestStreak = 14; // This would come from actual data
  
  // Achievements
  const achievements = [
    { id: 1, name: t("dashboard.achievements.earlyBird"), description: t("dashboard.achievements.earlyBirdDesc"), earned: true, icon: "🌅" },
    { id: 2, name: t("dashboard.achievements.focusMaster"), description: t("dashboard.achievements.focusMasterDesc"), earned: true, icon: "🧠" },
    { id: 3, name: t("dashboard.achievements.taskWarrior"), description: t("dashboard.achievements.taskWarriorDesc"), earned: false, icon: "⚔️" },
    { id: 4, name: t("dashboard.achievements.pomodoroPro"), description: t("dashboard.achievements.pomodoroProDesc"), earned: false, icon: "🍅" },
    { id: 5, name: t("dashboard.achievements.planningWizard"), description: t("dashboard.achievements.planningWizardDesc"), earned: true, icon: "📅" },
  ];
  
  const earnedAchievements = achievements.filter(a => a.earned);

  return (
    <div className="space-y-6">
      <Card className="glass-morphism border-zenta-purple/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Trophy className="h-5 w-5 text-zenta-purple mr-2" />
            {t("dashboard.yourProgress")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Level progress indicator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-zenta-purple rounded-full flex items-center justify-center text-white font-bold text-xl">
              {level}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{t("dashboard.level")} {level}</div>
                <div className="text-sm text-muted-foreground">
                  {currentLevelXP}/{xpForNextLevel} XP
                </div>
              </div>
              <Progress 
                value={xpProgress} 
                className="h-2 mt-2" 
              />
            </div>
          </div>
          
          {/* Tabs for different stats */}
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-2">
              <TabsTrigger value="stats">{t("dashboard.stats")}</TabsTrigger>
              <TabsTrigger value="streaks">{t("dashboard.streaks")}</TabsTrigger>
              <TabsTrigger value="achievements">{t("dashboard.achievements.title")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <StatsItem 
                  label={t("dashboard.totalXP")}
                  value={`${totalXP} XP`}
                />
                
                <StatsItem 
                  label={t("dashboard.totalTasksCompleted")}
                  value={completedTasks.toString()}
                />
                
                <StatsItem 
                  label={t("dashboard.focusTime")}
                  value={`${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`}
                />
                
                <StatsItem 
                  label={t("dashboard.completedPomodoros")}
                  value={completedPomodoros.toString()}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="streaks" className="mt-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-muted-foreground">{t("dashboard.currentStreak")}</div>
                  <div className="flex items-center">
                    <FlameIcon className="h-5 w-5 text-zenta-orange mr-2" />
                    <span className="text-lg font-bold">{currentStreak} {t("dashboard.days")}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">{t("dashboard.longestStreak")}</div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-zenta-purple mr-2" />
                    <span className="text-lg font-bold">{longestStreak} {t("dashboard.days")}</span>
                  </div>
                </div>
              </div>
              
              <WeeklyStreak activeDays={5} />
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-4">
              <div className="text-sm text-muted-foreground mb-4">
                {earnedAchievements.length}/{achievements.length} {t("dashboard.achievements.unlocked")}
              </div>
              
              <div className="space-y-3">
                {achievements.map(achievement => (
                  <Achievement 
                    key={achievement.id}
                    achievement={achievement}
                    earnedText={t("dashboard.achievements.earned")}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatsItemProps {
  label: string;
  value: string;
}

const StatsItem = ({ label, value }: StatsItemProps) => (
  <div className="space-y-1 bg-secondary/30 p-3 rounded-lg border border-secondary/50">
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="text-lg font-bold">{value}</div>
  </div>
);

interface WeeklyStreakProps {
  activeDays: number;
}

const WeeklyStreak = ({ activeDays }: WeeklyStreakProps) => {
  const { t } = useLanguage();
  const weekdays = [
    t("dashboard.weekdays.mon"),
    t("dashboard.weekdays.tue"),
    t("dashboard.weekdays.wed"),
    t("dashboard.weekdays.thu"),
    t("dashboard.weekdays.fri"),
    t("dashboard.weekdays.sat"),
    t("dashboard.weekdays.sun"),
  ];
  
  return (
    <div>
      <div className="flex justify-between space-x-1">
        {weekdays.map((day, i) => (
          <div 
            key={i} 
            className={cn(
              "flex-1 h-8 rounded-md flex items-center justify-center text-xs",
              i < activeDays 
                ? "bg-zenta-purple text-white" 
                : "bg-secondary/30 text-muted-foreground border border-secondary/50"
            )}
          >
            {day.charAt(0)}
          </div>
        ))}
      </div>
    </div>
  );
};

interface AchievementProps {
  achievement: {
    id: number;
    name: string;
    description: string;
    earned: boolean;
    icon: string;
  };
  earnedText: string;
}

const Achievement = ({ achievement, earnedText }: AchievementProps) => (
  <div 
    className={cn(
      "flex items-center p-3 rounded-lg border",
      achievement.earned 
        ? "bg-secondary/30 border-secondary/50" 
        : "bg-muted/30 opacity-50 border-muted/50"
    )}
  >
    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center mr-3 text-lg">
      {achievement.icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium flex items-center">
        {achievement.name}
        {achievement.earned && (
          <Badge variant="secondary" className="ml-2 bg-zenta-purple text-white text-xs">
            {earnedText}
          </Badge>
        )}
      </div>
      <div className="text-xs text-muted-foreground truncate">
        {achievement.description}
      </div>
    </div>
  </div>
);

export default DashboardStats;
