
import { cn } from "@/lib/utils";
import { useSidebarState } from "./useSidebarState";
import { SidebarMobileTrigger } from "./SidebarMobileTrigger";
import { SidebarMobileOverlay } from "./SidebarMobileOverlay";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";

const Sidebar = () => {
  const { isOpen, isCollapsed, toggleSidebar, toggleCollapse } = useSidebarState();

  return (
    <>
      <SidebarMobileTrigger onClick={toggleSidebar} />
      <SidebarMobileOverlay isOpen={isOpen} onClose={toggleSidebar} />

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
          <SidebarHeader 
            isCollapsed={isCollapsed} 
            toggleCollapse={toggleCollapse} 
            toggleSidebar={toggleSidebar} 
          />
          <SidebarNavigation isCollapsed={isCollapsed} />
          <SidebarFooter isCollapsed={isCollapsed} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
