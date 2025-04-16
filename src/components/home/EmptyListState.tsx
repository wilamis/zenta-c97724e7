
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EmptyListStateProps {
  onCreateList: () => void;
}

const EmptyListState = ({ onCreateList }: EmptyListStateProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="font-medium text-lg mb-2">{t('tasks.noLists')}</h3>
      <p className="text-muted-foreground mb-4">{t('tasks.createFirstList')}</p>
      <Button onClick={onCreateList}>
        {t('tasks.createFirstListButton')}
      </Button>
    </div>
  );
};

export default EmptyListState;
