
import { MoreVertical, Menu, Edit, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";

interface ColumnHeaderProps {
  title: string;
  onRenameClick: () => void;
  onDeleteClick: () => void;
  onClearClick?: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

const ColumnHeader = ({ 
  title, 
  onRenameClick, 
  onDeleteClick,
  onClearClick,
  onDragStart 
}: ColumnHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div 
      className="flex items-center justify-between p-3 border-b cursor-grab active:cursor-grabbing"
      draggable="true"
      onDragStart={onDragStart}
    >
      <div className="flex items-center gap-2">
        <Menu className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium text-base tracking-normal truncate">{title}</h3>
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRenameClick}>
              <Edit className="h-4 w-4 mr-2" />
              <span className="tracking-normal">{t('kanban.editColumn')}</span>
            </DropdownMenuItem>
            {onClearClick && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onClearClick}
              >
                <X className="h-4 w-4 mr-2" />
                <span className="tracking-normal">{t('kanban.clearColumn')}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={onDeleteClick}
            >
              <Trash className="h-4 w-4 mr-2" />
              <span className="tracking-normal">{t('kanban.deleteColumn')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ColumnHeader;
