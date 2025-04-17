
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  toggleSidebar: () => void;
}

export const SidebarHeader = ({
  isCollapsed,
  toggleCollapse,
  toggleSidebar,
}: SidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1
        className={cn(
          "font-bold text-zenta-purple transition-all duration-300",
          isCollapsed ? "text-xl" : "text-2xl"
        )}
      >
        {isCollapsed ? "Z" : "ZenTa"}
      </h1>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="hidden md:flex mr-2"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
