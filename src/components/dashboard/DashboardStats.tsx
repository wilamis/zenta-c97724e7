
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-morphism border-zenta-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.focusTime")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {Math.floor(focusMinutes / 60)}h {focusMinutes % 60}m
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("dashboard.todaysFocusedWork")}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-zenta-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.pomodoros")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {completedPomodoros}
              </div>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("dashboard.completedSessions")}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-zenta-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.taskCompletion")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {completionRate}%
              </div>
              <div className="text-xs text-muted-foreground">
                {completedTasks}/{totalTasks}
              </div>
            </div>
            <Progress 
              value={completionRate} 
              className="h-1 mt-2" 
            />
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass-morphism border-zenta-purple/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-zenta-purple mr-2" />
            {t("dashboard.yourProgress")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-zenta-purple rounded-full flex items-center justify-center text-white font-bold">
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
                className="h-2 mt-1" 
              />
            </div>
          </div>
          
          <Tabs defaultValue="stats">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="stats">{t("dashboard.stats")}</TabsTrigger>
              <TabsTrigger value="streaks">{t("dashboard.streaks")}</TabsTrigger>
              <TabsTrigger value="achievements">{t("dashboard.achievements.title")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{t("dashboard.totalXP")}</div>
                  <div className="text-lg font-bold">{totalXP} XP</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{t("dashboard.totalTasksCompleted")}</div>
                  <div className="text-lg font-bold">{completedTasks}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{t("dashboard.focusTime")}</div>
                  <div className="text-lg font-bold">
                    {Math.floor(focusMinutes / 60)}h {focusMinutes % 60}m
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{t("dashboard.completedPomodoros")}</div>
                  <div className="text-lg font-bold">{completedPomodoros}</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="streaks" className="pt-4">
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
              
              <div className="flex justify-between space-x-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex-1 h-2 rounded-full",
                      i < 5 ? "bg-zenta-purple" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{t("dashboard.weekdays.mon")}</span>
                <span>{t("dashboard.weekdays.tue")}</span>
                <span>{t("dashboard.weekdays.wed")}</span>
                <span>{t("dashboard.weekdays.thu")}</span>
                <span>{t("dashboard.weekdays.fri")}</span>
                <span>{t("dashboard.weekdays.sat")}</span>
                <span>{t("dashboard.weekdays.sun")}</span>
              </div>
            </TabsContent>
            
            <TabsContent value="achievements" className="pt-4">
              <div className="text-sm text-muted-foreground mb-4">
                {earnedAchievements.length}/{achievements.length} {t("dashboard.achievements.unlocked")}
              </div>
              
              <div className="space-y-2">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={cn(
                      "flex items-center p-2 rounded-lg",
                      achievement.earned ? "bg-secondary" : "bg-muted/30 opacity-50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mr-3 text-lg">
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="font-medium flex items-center">
                        {achievement.name}
                        {achievement.earned && (
                          <Badge variant="secondary" className="ml-2 bg-zenta-purple text-white">
                            {t("dashboard.achievements.earned")}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
