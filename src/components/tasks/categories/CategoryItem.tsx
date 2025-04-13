
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Edit, Trash } from "lucide-react";
import { Category } from "./types";

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete?: (id: string) => void;
  readonly?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onEdit,
  onDelete,
  readonly = false,
}) => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-2">
        <span className={cn("w-3 h-3 rounded-full", category.color)} />
        <span className="tracking-normal">{category.name}</span>
      </div>
      {!readonly && (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(category)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive"
              onClick={() => onDelete(category.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
