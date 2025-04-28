
import Layout from "@/components/layout/Layout";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Kanban = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [listTitle, setListTitle] = useState<string | null>(null);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const listId = queryParams.get('list');
    
    if (listId) {
      localStorage.setItem("current-list-id", listId);
      
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
  
  useEffect(() => {
    // Handle touch interactions more precisely
    const preventDefaultForDrag = (e: TouchEvent) => {
      // Only prevent default for draggable elements or kanban columns
      if (e.target instanceof Element && 
          (e.target.closest('[draggable="true"]') || 
           e.target.closest('.kanban-column') ||
           e.target.closest('.task-card'))) {
        // Don't prevent all events, just the ones that would interfere with dragging
        if (e.touches.length === 1) {
          // Don't prevent single finger scrolling by default
          const touchY = e.touches[0].clientY;
          const windowHeight = window.innerHeight;
          
          // If we're near the edges, allow scrolling
          if (touchY < 100 || touchY > windowHeight - 100) {
            return;
          }
          
          e.preventDefault();
        }
      }
    };

    // Use passive listeners where possible for better performance
    document.addEventListener('touchmove', preventDefaultForDrag, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventDefaultForDrag);
    };
  }, []);

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] flex flex-col w-full max-w-full items-center">
        <header className={`flex items-center justify-between gap-2 mb-2 ${isMobile ? 'p-2' : 'p-4'} w-full`}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className={isMobile ? "w-8 h-8 p-0" : ""}>
              <Link to="/">
                <ArrowLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              </Link>
            </Button>
            <LayoutGrid className={`${isMobile ? 'h-5 w-5' : 'h-7 w-7'} text-zenta-purple`} />
            <div>
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{t('kanban.title')}</h1>
              {listTitle && (
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{listTitle}</p>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 px-1 sm:px-4 pb-2 sm:pb-4 overflow-hidden w-full max-w-full flex justify-center">
          <KanbanBoard />
        </div>
      </div>
    </Layout>
  );
};

export default Kanban;
