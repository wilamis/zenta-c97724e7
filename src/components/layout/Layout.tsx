
import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    // Verificar o estado do sidebar no localStorage
    const checkSidebarState = () => {
      const sidebarState = localStorage.getItem("sidebar-collapsed");
      setIsCollapsed(sidebarState === "true");
    };
    
    // Verificar no carregamento inicial
    checkSidebarState();
    
    // Configurar um event listener para mudanças no localStorage
    const handleStorageChange = () => {
      checkSidebarState();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Observador de mudanças usando MutationObserver para compatibilidade entre abas
    const observer = new MutationObserver(checkSidebarState);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        "pt-16 md:pt-0", 
        isCollapsed ? "md:pl-20" : "md:pl-64",
      )}>
        <div className={cn(
          "container mx-auto py-6 px-4 md:px-8",
          isCollapsed && "max-w-7xl"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
