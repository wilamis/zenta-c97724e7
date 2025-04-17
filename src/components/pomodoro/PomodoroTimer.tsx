
import { Card, CardContent } from "../ui/card";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useLanguage } from "@/context/LanguageContext";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import TimerSettings from "./TimerSettings";
import TimerProgress from "./TimerProgress";
import TimerInfo from "./TimerInfo";

interface PomodoroTimerProps {
  onFocusSessionEnd?: () => void;
}

const PomodoroTimer = ({ onFocusSessionEnd }: PomodoroTimerProps) => {
  const { t } = useLanguage();
  const {
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
  } = usePomodoro({ onFocusSessionEnd, t });

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <Card className="overflow-hidden dark glass-morphism border-zenta-purple/20">
        <div className="relative">
          <TimerProgress progress={getTimerProgress()} />
          <CardContent className="pt-6">
            <TimerInfo mode={mode} t={t} />
            <TimerDisplay 
              time={formatTime(secondsLeft)} 
              mode={mode} 
              isPaused={isPaused} 
            />
            <TimerControls 
              isActive={isActive}
              isPaused={isPaused}
              mode={mode}
              onStart={startTimer}
              onPause={pauseTimer}
              onResume={resumeTimer}
              onReset={resetTimer}
              t={t}
            />
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
        <CardContent className="pt-6">
          <TimerSettings 
            workDuration={workDuration}
            breakDuration={breakDuration}
            soundEnabled={soundEnabled}
            autoStartBreaks={autoStartBreaks}
            autoStartPomodoros={autoStartPomodoros}
            isActive={isActive}
            mode={mode}
            onWorkDurationChange={handleWorkDurationChange}
            onBreakDurationChange={handleBreakDurationChange}
            onSoundEnabledChange={setSoundEnabled}
            onAutoStartBreaksChange={setAutoStartBreaks}
            onAutoStartPomodorosChange={setAutoStartPomodoros}
            t={t}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;
