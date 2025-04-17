
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface UsePomodoroProps {
  onFocusSessionEnd?: () => void;
  t: (key: string) => string;
}

export const usePomodoro = ({ onFocusSessionEnd, t }: UsePomodoroProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  
  const interval = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      interval.current = window.setInterval(() => {
        setSecondsLeft((seconds) => {
          if (seconds <= 1) {
            clearInterval(interval.current!);
            handleTimerComplete();
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    } else {
      if (interval.current) clearInterval(interval.current);
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [isActive, isPaused]);

  const handleTimerComplete = () => {
    if (soundEnabled) {
      // Play sound
      const audio = new Audio("/notification.mp3");
      audio.play();
    }

    if (mode === "work") {
      toast({
        title: t("pomodoro.pomodoroCompleted"),
        description: t("pomodoro.xpEarned"),
      });
      
      setCycles(c => c + 1);
      setMode("break");
      setSecondsLeft(breakDuration * 60);
      
      if (onFocusSessionEnd) {
        onFocusSessionEnd();
      }
      
      if (autoStartBreaks) {
        setIsActive(true);
        setIsPaused(false);
      } else {
        setIsActive(false);
      }
    } else {
      toast({
        title: t("pomodoro.breakTime"),
        description: t("pomodoro.readyForAnotherFocus"),
      });
      
      setMode("work");
      setSecondsLeft(workDuration * 60);
      
      if (autoStartPomodoros) {
        setIsActive(true);
        setIsPaused(false);
      } else {
        setIsActive(false);
      }
    }
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setMode("work");
    setSecondsLeft(workDuration * 60);
  };

  const handleWorkDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setWorkDuration(newDuration);
    if (mode === "work" && !isActive) {
      setSecondsLeft(newDuration * 60);
    }
  };

  const handleBreakDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setBreakDuration(newDuration);
    if (mode === "break" && !isActive) {
      setSecondsLeft(newDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerProgress = () => {
    const totalSeconds = mode === "work" ? workDuration * 60 : breakDuration * 60;
    return (secondsLeft / totalSeconds) * 100;
  };

  return {
    isActive,
    isPaused,
    mode,
    secondsLeft,
    workDuration,
    breakDuration,
    cycles,
    soundEnabled,
    autoStartBreaks,
    autoStartPomodoros,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    handleWorkDurationChange,
    handleBreakDurationChange,
    setSoundEnabled,
    setAutoStartBreaks,
    setAutoStartPomodoros,
    formatTime,
    getTimerProgress
  };
};
