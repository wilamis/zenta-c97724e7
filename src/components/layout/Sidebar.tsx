import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  CheckSquare, 
  Clock, 
  ListTodo, 
  Menu, 
  Settings, 
  Timer,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

type NavItem = {
  titleKey: string;
  icon: React.ElementType;
  path: string;
};

const navItems: NavItem[] = [
  {
    titleKey: "sidebar.dashboard",
    icon: Home,
    path: "/"
  },
  {
    titleKey: "sidebar.tasks",
    icon: ListTodo,
    path: "/tasks"
  },
  {
    titleKey: "sidebar.focus",
    icon: Clock,
    path: "/focus"
  },
  {
    titleKey: "sidebar.pomodoro",
    icon: Timer,
    path: "/pomodoro"
  },
  {
    titleKey: "sidebar.planner",
    icon: CheckSquare,
    path: "/planner"
  },
  {
    titleKey: "sidebar.settings",
    icon: Settings,
    path: "/settings"
  }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState === "true";
  });
  const location = useLocation();
  const { t } = useLanguage();

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
          "fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64",
          "bg-sidebar"
        )}
      >
        <div className="flex h-full flex-col px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className={cn(
              "font-bold text-zenta-purple transition-all duration-300",
              isCollapsed ? "text-xl" : "text-2xl"
            )}>
              {isCollapsed ? "Z" : "ZenTa"}
            </h1>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleCollapse}
                className="hidden md:flex mr-2"
              >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
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
                  "h-5 w-5",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )} />
                {!isCollapsed && (
                  <span className="ml-3 tracking-normal">{t(item.titleKey)}</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="space-y-4 mt-auto">
            {!isCollapsed && (
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-zenta-purple flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("sidebar.freePlan")}</p>
                    <p className="text-xs text-muted-foreground">{t("sidebar.upgradeText")}</p>
                  </div>
                </div>
              </div>
            )}
            
            {isCollapsed && (
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-zenta-purple flex items-center justify-center">
                  <CheckSquare className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
