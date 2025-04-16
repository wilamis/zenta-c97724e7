
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface CreateListDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
}

const CreateListDialog = ({
  isOpen,
  onOpenChange,
  title,
  onTitleChange,
  onSave
}: CreateListDialogProps) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('tasks.newList')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="list-title">{t('tasks.listTitle')}</Label>
            <Input
              id="list-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={t('tasks.listTitlePlaceholder')}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('taskModal.cancel')}
          </Button>
          <Button onClick={onSave} disabled={!title.trim()}>
            {t('tasks.createListButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListDialog;
