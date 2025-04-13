import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TaskCategory } from "./TaskItem";
import { Edit, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  code: TaskCategory;
  color: string;
}

export const defaultCategories: Category[] = [
  { id: "personal", name: "Personal", code: "p", color: "bg-zenta-purple" },
  { id: "business", name: "Business", code: "b", color: "bg-zenta-blue" },
  { id: "growth", name: "Growth", code: "g", color: "bg-zenta-green" },
];

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

const CategoryManager = ({
  isOpen,
  onClose,
  categories,
  onCategoriesChange,
}: CategoryManagerProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#8B5CF6"); // Default purple
  const [editId, setEditId] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const code = newCategoryName.trim().substring(0, 1).toLowerCase() as TaskCategory;
    
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
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">
              {editId ? "Update Category" : "Add New Category"}
            </Label>
            <div className="flex gap-2">
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1"
              />
              <Input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-12 p-1 h-10"
              />
              <Button
                onClick={editId ? handleUpdateCategory : handleAddCategory}
                disabled={!newCategoryName.trim()}
              >
                {editId ? "Update" : "Add"}
              </Button>
              {editId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditId(null);
                    setNewCategoryName("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Categories</Label>
            <div className="rounded-md border">
              {categories.length > 0 ? (
                <div className="divide-y">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-3 h-3 rounded-full",
                            category.color
                          )}
                        />
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No custom categories yet
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Categories</Label>
            <div className="rounded-md border">
              <div className="divide-y">
                {defaultCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 tracking-normal"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("w-3 h-3 rounded-full", category.color)}
                      />
                      <span className="tracking-normal">
                        {category.name === "Business" ? (
                          <>
                            <span className="align-super text-sm">B</span>
                            <span>usiness</span>
                          </>
                        ) : (
                          category.name
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManager;
