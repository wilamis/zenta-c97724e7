
import { Button } from "../ui/button";
import { Play, Pause, RefreshCcw } from "lucide-react";

interface TimerControlsProps {
  isActive: boolean;
  isPaused: boolean;
  mode: "work" | "break";
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  t: (key: string) => string;
}

const TimerControls = ({ 
  isActive, 
  isPaused, 
  mode, 
  onStart, 
  onPause, 
  onResume, 
  onReset,
  t
}: TimerControlsProps) => {
  return (
    <div className="flex justify-center space-x-4 mb-6">
      {!isActive ? (
        <Button 
          onClick={onStart} 
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
              onClick={onResume}
              variant="default"
              className="rounded-full px-6"
            >
              <Play className="w-5 h-5 mr-2" />
              {t("pomodoro.resume")}
            </Button>
          ) : (
            <Button 
              onClick={onPause}
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
        onClick={onReset} 
        variant="ghost"
        className="rounded-full"
        size="icon"
      >
        <RefreshCcw className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default TimerControls;
