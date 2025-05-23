
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import KanbanColumn from "./KanbanColumn";
import AddColumnDialog from "./AddColumnDialog";
import TaskModal from "../tasks/TaskModal";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import { useKanbanColumns } from "./useKanbanColumns";
import { useKanbanTasks } from "./useKanbanTasks";
import { useKanbanDragDrop } from "./useKanbanDragDrop";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const KanbanBoard = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const {
    columns,
    setColumns,
    isAddColumnOpen,
    setIsAddColumnOpen,
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    setEditingTask,
    activeColumn,
    setActiveColumn,
    draggedTaskInfo,
    setDraggedTaskInfo,
    draggedColumnId,
    setDraggedColumnId,
    toast
  } = useKanbanBoard();

  const {
    handleAddColumn,
    handleRenameColumn,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop
  } = useKanbanColumns({ columns, setColumns, toast });

  const {
    handleAddTask,
    handleEditTask,
    handleTaskSave,
    handleTaskDelete,
    handleTaskComplete
  } = useKanbanTasks({ 
    columns, 
    setColumns, 
    setActiveColumn, 
    setEditingTask, 
    setIsTaskModalOpen,
    toast,
    activeColumn,
    editingTask
  });

  const {
    handleDragStart,
    handleDragOver,
    handleDrop
  } = useKanbanDragDrop({
    columns,
    setColumns,
    draggedTaskInfo,
    setDraggedTaskInfo,
    toast
  });

  const onColumnDragStart = (e: React.DragEvent, columnId: string) => {
    if (isMobile) return; // Disable column dragging on mobile
    setDraggedColumnId(columnId);
    handleColumnDragStart(e, columnId);
  };

  const onColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    if (isMobile) return; // Disable column dragging on mobile
    handleColumnDrop(e, targetColumnId, draggedColumnId);
    setDraggedColumnId(null);
  };

  const handleOpenAddTaskModal = () => {
    if (!activeColumn && columns.length > 0) {
      setActiveColumn(columns[0].id);
    }
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };
  
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setActiveColumn(null);
    setEditingTask(null);
  };

  return (
    <div className="space-y-4 h-full w-full max-w-full flex flex-col items-center">
      <div className="flex justify-end items-center mb-2 sm:mb-4 w-full px-2 sm:px-4">
        <Button 
          onClick={handleOpenAddTaskModal}
          className="flex items-center gap-2 bg-[#9b87f5] hover:bg-[#8B5CF6] transition-colors"
          size={isMobile ? "sm" : "default"}
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">{t('tasks.addTask')}</span>
        </Button>
      </div>
      
      <ScrollArea 
        className="kanban-board-container h-[75vh] sm:h-[80vh] md:h-[700px] w-full max-w-full overflow-x-auto"
        scrollHideDelay={0}
      >
        <div
          className={`
            flex gap-3 sm:gap-4 pb-4 px-1 sm:px-4
            min-w-max
          `}
          style={{
            flexWrap: "nowrap",
            overflowX: "scroll",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              onRename={handleRenameColumn}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleTaskDelete}
              onCompleteTask={handleTaskComplete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onColumnDragStart={onColumnDragStart}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={onColumnDrop}
              isDraggingColumn={!!draggedColumnId}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className={isMobile ? "h-1.5" : "h-2"} />
      </ScrollArea>
      
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          onSave={handleTaskSave}
          task={editingTask || undefined}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
