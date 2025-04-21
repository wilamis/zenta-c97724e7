
import { useLocation } from "react-router-dom";
import {
  Home,
  CheckSquare,
  Clock,
  ListTodo,
  Settings,
  Timer,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SidebarNavItem } from "./SidebarNavItem";

interface SidebarNavigationProps {
  isCollapsed: boolean;
}

export const SidebarNavigation = ({ isCollapsed }: SidebarNavigationProps) => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    {
      titleKey: "sidebar.dashboard",
      icon: Home,
      path: "/",
    },
    {
      titleKey: "sidebar.tasks",
      icon: ListTodo,
      path: "/tasks",
    },
    {
      titleKey: "sidebar.focus",
      icon: Clock,
      path: "/focus",
    },
    {
      titleKey: "sidebar.pomodoro",
      icon: Timer,
      path: "/pomodoro",
    },
    {
      titleKey: "sidebar.settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <nav className="flex-1 space-y-1">
      {navItems.map((item) => (
        <SidebarNavItem
          key={item.path}
          to={item.path}
          icon={item.icon}
          title={t(item.titleKey)}
          isActive={location.pathname === item.path}
          isCollapsed={isCollapsed}
        />
      ))}
    </nav>
  );
};
