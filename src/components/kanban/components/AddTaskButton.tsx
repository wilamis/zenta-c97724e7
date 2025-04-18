
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface AddTaskButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const AddTaskButton = ({ onClick }: AddTaskButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      variant="ghost"
      className="justify-start text-muted-foreground text-sm h-8 w-full"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      type="button"
    >
      <Plus className="h-4 w-4 mr-1" />
      <span className="tracking-normal">{t('tasks.addTask')}</span>
    </Button>
  );
};

export default AddTaskButton;
