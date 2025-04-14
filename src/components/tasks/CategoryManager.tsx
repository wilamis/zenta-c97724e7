
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Category, defaultCategories } from "./categories/types";
import CategoryForm from "./categories/CategoryForm";
import CategoryList from "./categories/CategoryList";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  isOpen,
  onClose,
  categories,
  onCategoriesChange,
}) => {
  const { t } = useLanguage();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#8B5CF6"); // Default purple
  const [editId, setEditId] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const code = newCategoryName.trim().substring(0, 1).toLowerCase() as any;
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      code,
      color: `bg-[${newCategoryColor}]`,
    };

    onCategoriesChange([...categories, newCategory]);
    setNewCategoryName("");
  };

  const handleEditCategory = (category: Category) => {
    setEditId(category.id);
    setNewCategoryName(category.name);
    setNewCategoryColor(category.color.replace("bg-[", "").replace("]", ""));
  };

  const handleUpdateCategory = () => {
    if (!editId || !newCategoryName.trim()) return;

    const updatedCategories = categories.map((cat) =>
      cat.id === editId
        ? {
            ...cat,
            name: newCategoryName.trim(),
            color: `bg-[${newCategoryColor}]`,
          }
        : cat
    );

    onCategoriesChange(updatedCategories);
    setEditId(null);
    setNewCategoryName("");
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter((cat) => cat.id !== id);
    onCategoriesChange(updatedCategories);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("categoryManager.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <CategoryForm
            categoryName={newCategoryName}
            categoryColor={newCategoryColor}
            isEditing={!!editId}
            onNameChange={setNewCategoryName}
            onColorChange={setNewCategoryColor}
            onSubmit={editId ? handleUpdateCategory : handleAddCategory}
            onCancel={() => {
              setEditId(null);
              setNewCategoryName("");
            }}
          />

          <CategoryList
            title={t("categoryManager.yourCategories")}
            categories={categories}
            emptyMessage={t("categoryManager.noCustomCategories")}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />

          <CategoryList
            title={t("categoryManager.defaultCategories")}
            categories={defaultCategories}
            readonly={true}
          />

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              {t("categoryManager.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManager;
