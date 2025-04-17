
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  time: string;
  mode: "work" | "break";
  isPaused: boolean;
}

const TimerDisplay = ({ time, mode, isPaused }: TimerDisplayProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div 
        className={cn(
          "text-6xl font-bold transition-all duration-500",
          mode === "work" ? "text-zenta-purple" : "text-zenta-green",
          isPaused && "animate-pulse"
        )}
      >
        {time}
      </div>
    </div>
  );
};

export default TimerDisplay;
