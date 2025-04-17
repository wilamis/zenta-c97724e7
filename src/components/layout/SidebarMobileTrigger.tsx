
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarMobileTriggerProps {
  onClick: () => void;
}

export const SidebarMobileTrigger = ({ onClick }: SidebarMobileTriggerProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 left-4 z-50 md:hidden"
      onClick={onClick}
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
};
