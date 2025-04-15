
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  progress?: number;
}

const StatsCard = ({ title, value, description, icon, progress }: StatsCardProps) => {
  return (
    <Card className="glass-morphism border-zenta-purple/20">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          {icon && <div>{icon}</div>}
        </div>
        {progress !== undefined && (
          <div className="w-full h-1 bg-muted mt-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-zenta-purple transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
