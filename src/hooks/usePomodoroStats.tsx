
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { useLanguage } from "@/context/LanguageContext";

export const usePomodoroStats = () => {
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

  return {
    completedPomodoros,
    handleFocusSessionEnd
  };
};
