
import React from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface CategoryFormProps {
  categoryName: string;
  categoryColor: string;
  isEditing: boolean;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryName,
  categoryColor,
  isEditing,
  onNameChange,
  onColorChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category-name">
        {isEditing ? "Update Category" : "Add New Category"}
      </Label>
      <div className="flex gap-2">
        <Input
          id="category-name"
          value={categoryName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Category name"
          className="flex-1"
        />
        <Input
          type="color"
          value={categoryColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-12 p-1 h-10"
        />
        <Button onClick={onSubmit} disabled={!categoryName.trim()}>
          {isEditing ? "Update" : "Add"}
        </Button>
        {isEditing && onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryForm;
