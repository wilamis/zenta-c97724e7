
import { Timer } from "lucide-react";

interface PomodoroHeaderProps {
  title: string;
  subtitle: string;
}

const PomodoroHeader = ({ title, subtitle }: PomodoroHeaderProps) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
        <Timer className="h-8 w-8 text-zenta-purple" />
        {title}
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md mx-auto">
        {subtitle}
      </p>
    </header>
  );
};

export default PomodoroHeader;
