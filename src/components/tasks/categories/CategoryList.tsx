
import React from "react";
import { Label } from "../../ui/label";
import { Category } from "./types";
import CategoryItem from "./CategoryItem";

interface CategoryListProps {
  title: string;
  categories: Category[];
  emptyMessage?: string;
  onEdit?: (category: Category) => void;
  onDelete?: (id: string) => void;
  readonly?: boolean;
}

const CategoryList: React.FC<CategoryListProps> = ({
  title,
  categories,
  emptyMessage = "No categories yet",
  onEdit,
  onDelete,
  readonly = false,
}) => {
  return (
    <div className="space-y-2">
      <Label>{title}</Label>
      <div className="rounded-md border">
        {categories.length > 0 ? (
          <div className="divide-y">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={onEdit || (() => {})}
                onDelete={onDelete}
                readonly={readonly}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
