
import { CircleCheck } from "lucide-react";

const EmptyColumnState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
      <CircleCheck 
        className="h-4 w-4 mb-2" 
        strokeWidth={1.5}
        color="#8B5CF6"
        opacity={0.7}
      />
      <p className="text-xs font-bold text-gray-500">
        Tudo certo por aqui.
      </p>
    </div>
  );
};

export default EmptyColumnState;
