
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/context/LanguageContext";

interface ClearColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClear: () => void;
  isClearing: boolean;
}

const ClearColumnDialog = ({ 
  isOpen, 
  onOpenChange, 
  onClear, 
  isClearing 
}: ClearColumnDialogProps) => {
  const { t } = useLanguage();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('kanban.clearColumn')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('kanban.clearColumnDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('kanban.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClear}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isClearing}
          >
            {t('kanban.clearColumnAction')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearColumnDialog;
