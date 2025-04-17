
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Pause, Play, RefreshCcw, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

interface PomodoroTimerProps {
  onFocusSessionEnd?: () => void;
}

const PomodoroTimer = ({ onFocusSessionEnd }: PomodoroTimerProps) => {
  const { t } = useLanguage();
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

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <Card className="overflow-hidden dark glass-morphism border-zenta-purple/20">
        <div className="relative">
          <div 
            className="absolute bottom-0 left-0 h-1 bg-zenta-purple transition-all"
            style={{ width: `${getTimerProgress()}%` }}
          />
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                {mode === "work" 
                  ? t("pomodoro.focusSession") 
                  : t("pomodoro.shortBreak")}
              </h2>
              <p className="text-muted-foreground text-sm">
                {mode === "work" 
                  ? "Mantenha o foco na sua tarefa" 
                  : "Tire um momento para relaxar"}
              </p>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div 
                className={cn(
                  "text-6xl font-bold transition-all duration-500",
                  mode === "work" ? "text-zenta-purple" : "text-zenta-green",
                  isPaused && "animate-pulse"
                )}
              >
                {formatTime(secondsLeft)}
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              {!isActive ? (
                <Button 
                  onClick={startTimer} 
                  className="rounded-full px-6"
                  variant={mode === "work" ? "default" : "outline"}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t("pomodoro.start")}
                </Button>
              ) : (
                <>
                  {isPaused ? (
                    <Button 
                      onClick={resumeTimer}
                      variant="default"
                      className="rounded-full px-6"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {t("pomodoro.resume")}
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseTimer}
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      {t("pomodoro.pause")}
                    </Button>
                  )}
                </>
              )}
              <Button 
                onClick={resetTimer} 
                variant="ghost"
                className="rounded-full"
                size="icon"
              >
                <RefreshCcw className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {cycles > 0 && (
                <span>
                  {t("pomodoro.completed")} {cycles} {cycles === 1 ? t("pomodoro.cycle") : t("pomodoro.cycles")}
                </span>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      <Card className="glass-morphism border-zenta-purple/20">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("pomodoro.workSprint")}</Label>
              <span className="text-sm font-medium">{workDuration} min</span>
            </div>
            <Slider
              value={[workDuration]}
              min={5}
              max={120}
              step={5}
              onValueChange={handleWorkDurationChange}
              disabled={isActive}
              className={mode === "work" ? "text-zenta-purple" : undefined}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("pomodoro.break")}</Label>
              <span className="text-sm font-medium">{breakDuration} min</span>
            </div>
            <Slider
              value={[breakDuration]}
              min={1}
              max={30}
              step={1}
              onValueChange={handleBreakDurationChange}
              disabled={isActive}
              className={mode === "break" ? "text-zenta-green" : undefined}
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="sound">{t("pomodoro.soundNotifications")}</Label>
              </div>
              <Switch
                id="sound"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoStartBreaks">{t("pomodoro.autoStartBreaks")}</Label>
              <Switch
                id="autoStartBreaks"
                checked={autoStartBreaks}
                onCheckedChange={setAutoStartBreaks}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoStartPomodoros">{t("pomodoro.autoStartWorkSprints")}</Label>
              <Switch
                id="autoStartPomodoros"
                checked={autoStartPomodoros}
                onCheckedChange={setAutoStartPomodoros}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;
