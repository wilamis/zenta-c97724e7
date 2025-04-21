
import { TaskCategory } from "../TaskItem";

export interface Category {
  id: string;
  name: string;
  code: TaskCategory;
  color: string;
}

export const defaultCategories: Category[] = [
  { id: "personal", name: "Pessoal", code: "p", color: "bg-zenta-purple" },
];

