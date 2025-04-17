
import { useState } from 'react';
import { Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";

interface ListHeaderProps {
  isRenaming: boolean;
  title: string;
  newTitle: string;
  totalTime: number;
  onRename: () => void;
  onRenameStart: () => void;
  onDelete: () => void;
  setNewTitle: (title: string) => void;
}

export const ListHeader = ({ 
  isRenaming, 
  title, 
  newTitle, 
  totalTime, 
  onRename, 
  onRenameStart, 
  onDelete, 
  setNewTitle 
}: ListHeaderProps) => {
  return (
    <div className="p-4 flex items-center justify-between">
      {isRenaming ? (
        <RenameInput 
          newTitle={newTitle} 
          setNewTitle={setNewTitle} 
          onRename={onRename} 
        />
      ) : (
        <TitleDisplay 
          title={title} 
          totalTime={totalTime} 
          onRenameStart={onRenameStart} 
          onDelete={onDelete} 
        />
      )}
    </div>
  );
};

// Rename input component
interface RenameInputProps {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onRename: () => void;
}

export const RenameInput = ({ newTitle, setNewTitle, onRename }: RenameInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onRename();
    }
  };
  
  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        autoFocus
        onBlur={onRename}
        onKeyDown={handleKeyDown}
      />
      <Button size="sm" variant="default" onClick={onRename}>OK</Button>
    </div>
  );
};

// Title display component
interface TitleDisplayProps {
  title: string;
  totalTime: number;
  onRenameStart: () => void;
  onDelete: () => void;
}

export const TitleDisplay = ({ title, totalTime, onRenameStart, onDelete }: TitleDisplayProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <h3 className="font-medium">{title}</h3>
      <div className="flex items-center gap-2">
        {totalTime > 0 && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {totalTime} min
          </Badge>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRenameStart}>
              {t('tasks.rename')}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              {t('tasks.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
