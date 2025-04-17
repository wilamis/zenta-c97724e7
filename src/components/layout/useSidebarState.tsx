
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useSidebarState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState === "true";
  });
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return {
    isOpen,
    isCollapsed,
    toggleSidebar,
    toggleCollapse
  };
};
