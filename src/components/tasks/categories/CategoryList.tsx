
import { useLanguage } from "@/context/LanguageContext";
import { Category } from "./types";
import CategoryItem from "./CategoryItem";

interface CategoryListProps {
  title: string;
  categories: Category[];
  emptyMessage?: string;
  readonly?: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (id: string) => void;
}

const CategoryList = ({
  title,
  categories,
  emptyMessage,
  readonly = false,
  onEdit,
  onDelete,
}: CategoryListProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">{emptyMessage}</p>
      ) : (
        <div className="space-y-1">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              readonly={readonly}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
