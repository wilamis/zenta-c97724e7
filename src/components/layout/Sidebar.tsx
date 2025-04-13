
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Home, 
  ListTodo, 
  Menu, 
  Settings, 
  Timer, 
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/"
  },
  {
    title: "Tasks",
    icon: ListTodo,
    path: "/tasks"
  },
  {
    title: "Focus",
    icon: Clock,
    path: "/focus"
  },
  {
    title: "Pomodoro",
    icon: Timer,
    path: "/pomodoro"
  },
  {
    title: "Planner",
    icon: Calendar,
    path: "/planner"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings"
  }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden" 
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-zenta-purple">ZenTa</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all",
                  location.pathname === item.path 
                    ? "bg-secondary text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )} />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          <div className="rounded-lg bg-secondary p-4 mt-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-zenta-purple flex items-center justify-center">
                <CheckSquare className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Free Plan</p>
                <p className="text-xs text-muted-foreground">Upgrade for more features</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
