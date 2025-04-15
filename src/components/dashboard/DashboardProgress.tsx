
interface DashboardProgressProps {
  level: number;
  currentXP: number;
  maxXP: number;
}

const DashboardProgress = ({ level, currentXP, maxXP }: DashboardProgressProps) => {
  const progress = (currentXP / maxXP) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-zenta-purple rounded-full flex items-center justify-center text-white font-bold">
          {level}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-medium">Level {level}</div>
            <div className="text-sm text-muted-foreground">
              {currentXP}/{maxXP} XP
            </div>
          </div>
          <div className="w-full h-2 bg-muted mt-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-zenta-purple transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProgress;
