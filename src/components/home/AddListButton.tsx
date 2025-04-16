
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AddListButtonProps {
  onClick: () => void;
}

const AddListButton = ({ onClick }: AddListButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="h-full min-h-[200px] border-dashed flex flex-col gap-4 items-center justify-center"
    >
      <Plus className="h-8 w-8" />
      <span>{t('tasks.createNewList')}</span>
    </Button>
  );
};

export default AddListButton;
