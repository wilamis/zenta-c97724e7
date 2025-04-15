
import { useState } from "react";
import Layout from "../components/layout/Layout";
import PomodoroTimer from "../components/pomodoro/PomodoroTimer";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

const Pomodoro = () => {
  const { t } = useLanguage();
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    const savedPomodoros = localStorage.getItem("zenta-completed-pomodoros");
    return savedPomodoros ? parseInt(savedPomodoros) : 0;
  });
  
  const { toast } = useToast();
  
  const handleFocusSessionEnd = () => {
    const newCount = completedPomodoros + 1;
    setCompletedPomodoros(newCount);
    localStorage.setItem("zenta-completed-pomodoros", newCount.toString());
    
    // Add XP notification
    toast({
      title: t('pomodoro.pomodoroCompleted'),
      description: t('pomodoro.xpEarned'),
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold">{t('pomodoro.title')}</h1>
          <p className="text-muted-foreground">
            {t('pomodoro.subtitle')}
          </p>
        </header>
        
        <PomodoroTimer onFocusSessionEnd={handleFocusSessionEnd} />
      </div>
    </Layout>
  );
};

export default Pomodoro;
