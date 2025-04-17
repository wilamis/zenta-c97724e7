
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  to: string;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  isCollapsed: boolean;
}

export const SidebarNavItem = ({
  to,
  icon: Icon,
  title,
  isActive,
  isCollapsed,
}: SidebarNavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all",
        isActive
          ? "bg-secondary text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      />
      {!isCollapsed && <span className="ml-3 tracking-normal">{title}</span>}
    </Link>
  );
};
