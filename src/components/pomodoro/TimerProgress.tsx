
interface TimerProgressProps {
  progress: number;
}

const TimerProgress = ({ progress }: TimerProgressProps) => {
  return (
    <div 
      className="absolute bottom-0 left-0 h-1 bg-zenta-purple transition-all"
      style={{ width: `${progress}%` }}
    />
  );
};

export default TimerProgress;
