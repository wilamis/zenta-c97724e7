
import { cn } from "@/lib/utils";

interface SidebarMobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarMobileOverlay = ({
  isOpen,
  onClose,
}: SidebarMobileOverlayProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity md:hidden",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    />
  );
};
