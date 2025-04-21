
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";

interface RenameColumnDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (title: string) => void;
  currentTitle: string;
}

const RenameColumnDialog = ({ 
  isOpen, 
  onClose, 
  onRename, 
  currentTitle 
}: RenameColumnDialogProps) => {
  const [title, setTitle] = useState(currentTitle);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onRename(title);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('kanban.editColumn')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="columnTitle">{t('kanban.columnTitle')}</Label>
            <Input
              id="columnTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('kanban.columnTitle')}
              className="w-full"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              {t('kanban.cancel')}
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {t('kanban.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameColumnDialog;

