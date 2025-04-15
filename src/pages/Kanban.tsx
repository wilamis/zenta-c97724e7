
import Layout from "@/components/layout/Layout";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LayoutGrid } from "lucide-react";

const Kanban = () => {
  const { t } = useLanguage();
  
  // Add touch event polyfill for mobile drag and drop support
  useEffect(() => {
    // Prevent default touch behavior that might interfere with drag operations
    const preventDefaultTouchBehavior = (e: TouchEvent) => {
      if (e.target instanceof Element && 
          (e.target.closest('[draggable="true"]') || 
           e.target.closest('.kanban-column'))) {
        e.preventDefault();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // This helps browsers understand that we're intentionally handling touch events
      // for drag and drop operations
      if (e.target instanceof Element && 
          (e.target.closest('[draggable="true"]') || 
           e.target.closest('.kanban-column'))) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventDefaultTouchBehavior, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventDefaultTouchBehavior);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6">
        <header className="flex items-center gap-2 mb-6">
          <LayoutGrid className="h-7 w-7 text-zenta-purple" />
          <h1 className="text-3xl font-bold">{t('kanban.title')}</h1>
        </header>
        <KanbanBoard />
      </div>
    </Layout>
  );
};

export default Kanban;
