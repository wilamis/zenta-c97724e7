
import Layout from "@/components/layout/Layout";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Kanban = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [listTitle, setListTitle] = useState<string | null>(null);
  
  // Extract list ID from URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const listId = queryParams.get('list');
    
    if (listId) {
      // Store the current list ID in localStorage
      localStorage.setItem("current-list-id", listId);
      
      // Get list title from localStorage
      const savedLists = localStorage.getItem("task-lists");
      if (savedLists) {
        const lists = JSON.parse(savedLists);
        const list = lists.find((l: any) => l.id === listId);
        if (list) {
          setListTitle(list.title);
        }
      }
    } else {
      localStorage.removeItem("current-list-id");
    }
  }, [location.search]);
  
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
        <header className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <LayoutGrid className="h-7 w-7 text-zenta-purple" />
            <div>
              <h1 className="text-3xl font-bold">{t('kanban.title')}</h1>
              {listTitle && (
                <p className="text-muted-foreground">{listTitle}</p>
              )}
            </div>
          </div>
        </header>
        <KanbanBoard />
      </div>
    </Layout>
  );
};

export default Kanban;
