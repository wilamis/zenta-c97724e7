
import { TaskCategory } from "../TaskItem";

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
