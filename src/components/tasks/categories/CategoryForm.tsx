
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryFormProps {
  categoryName: string;
  categoryColor: string;
  isEditing: boolean;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CategoryForm = ({
  categoryName,
  categoryColor,
  isEditing,
  onNameChange,
  onColorChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const { t } = useLanguage();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-name">{t("categoryManager.categoryName")}</Label>
        <Input
          id="category-name"
          value={categoryName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Work, Personal, etc."
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-color">{t("categoryManager.categoryColor")}</Label>
        <Input
          id="category-color"
          type="color"
          value={categoryColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-10 p-1 cursor-pointer"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {isEditing && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("categoryManager.cancel")}
          </Button>
        )}
        <Button type="submit" disabled={!categoryName.trim()}>
          {isEditing ? t("categoryManager.update") : t("categoryManager.add")}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
