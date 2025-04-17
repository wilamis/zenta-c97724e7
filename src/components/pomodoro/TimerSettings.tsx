
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Volume2 } from "lucide-react";

interface TimerSettingsProps {
  workDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  isActive: boolean;
  mode: "work" | "break";
  onWorkDurationChange: (value: number[]) => void;
  onBreakDurationChange: (value: number[]) => void;
  onSoundEnabledChange: (value: boolean) => void;
  onAutoStartBreaksChange: (value: boolean) => void;
  onAutoStartPomodorosChange: (value: boolean) => void;
  t: (key: string) => string;
}

const TimerSettings = ({
  workDuration,
  breakDuration,
  soundEnabled,
  autoStartBreaks,
  autoStartPomodoros,
  isActive,
  mode,
  onWorkDurationChange,
  onBreakDurationChange,
  onSoundEnabledChange,
  onAutoStartBreaksChange,
  onAutoStartPomodorosChange,
  t
}: TimerSettingsProps) => {
  return (
    <div className="space-y-6 pt-6">
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
          onValueChange={onWorkDurationChange}
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
          onValueChange={onBreakDurationChange}
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
            onCheckedChange={onSoundEnabledChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoStartBreaks">{t("pomodoro.autoStartBreaks")}</Label>
          <Switch
            id="autoStartBreaks"
            checked={autoStartBreaks}
            onCheckedChange={onAutoStartBreaksChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoStartPomodoros">{t("pomodoro.autoStartWorkSprints")}</Label>
          <Switch
            id="autoStartPomodoros"
            checked={autoStartPomodoros}
            onCheckedChange={onAutoStartPomodorosChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TimerSettings;
