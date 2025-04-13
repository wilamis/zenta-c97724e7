
import { useState } from "react";
import Layout from "../components/layout/Layout";
import PomodoroTimer from "../components/pomodoro/PomodoroTimer";
import { useToast } from "@/hooks/use-toast";

const Pomodoro = () => {
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
      title: "Pomodoro completed!",
      description: "+15 XP earned for your focus session",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold">Pomodoros</h1>
          <p className="text-muted-foreground">
            Technique to work in fixed intervals & breaks
          </p>
        </header>
        
        <PomodoroTimer onFocusSessionEnd={handleFocusSessionEnd} />
      </div>
    </Layout>
  );
};

export default Pomodoro;
