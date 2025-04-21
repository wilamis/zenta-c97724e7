
import { MoreVertical, Menu, Edit } from "lucide-react";
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
  onClearClick?: () => void;
  onDragStart: (e: React.DragEvent) => void;
  isMobile?: boolean;
}

const ColumnHeader = ({ 
  title, 
  onRenameClick, 
  onClearClick,
  onDragStart,
  isMobile
}: ColumnHeaderProps) => {
  const { t } = useLanguage();

  const handleRenameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRenameClick();
  };

  return (
    <div 
      className="flex items-center justify-between p-3 border-b cursor-grab active:cursor-grabbing"
      draggable={!isMobile ? "true" : undefined}
      onDragStart={!isMobile ? onDragStart : undefined}
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
            <DropdownMenuItem onClick={handleRenameClick}>
              <Edit className="h-4 w-4 mr-2" />
              <span className="tracking-normal">{t('kanban.editColumn')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ColumnHeader;
