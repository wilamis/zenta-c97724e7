
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Task, TaskCategory, TaskPriority } from "./TaskItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Clock, AlignLeft } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Category, defaultCategories } from "./CategoryManager";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task;
  categories?: Category[];
}

const TaskModal = ({ isOpen, onClose, onSave, task, categories = defaultCategories }: TaskModalProps) => {
  const [title, setTitle] = useState(task?.title || "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [category, setCategory] = useState<TaskCategory>(task?.category || null);
  const [estimatedTime, setEstimatedTime] = useState<number>(task?.estimatedTime || 30);
  const [description, setDescription] = useState(task?.description || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: task?.id || "",
      title,
      completed: task?.completed || false,
      priority,
      category,
      estimatedTime,
      description,
      dueDate: task?.dueDate
    });
  };

  const getCategoryColor = (code: TaskCategory) => {
    if (!code) return "";
    const category = categories.find(cat => cat.code === code);
    return category ? category.color : "";
  };

  const getCategoryName = (code: TaskCategory) => {
    if (!code) return "No category";
    const category = categories.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-1">
              <AlignLeft className="h-4 w-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes or details about this task..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as TaskPriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-zenta-green mr-2"></span>
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-zenta-blue mr-2"></span>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-zenta-red mr-2"></span>
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category || "none"} 
                onValueChange={(value) => setCategory(value === "none" ? null : (value as TaskCategory))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center">
                      No category
                    </div>
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.code}>
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full ${cat.color} mr-2`}></span>
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedTime">Estimated time</Label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={estimatedTime.toString()} 
                onValueChange={(value) => setEstimatedTime(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estimated time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {task ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
