
interface TimerInfoProps {
  mode: "work" | "break";
  t: (key: string) => string;
}

const TimerInfo = ({ mode, t }: TimerInfoProps) => {
  return (
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
  );
};

export default TimerInfo;
