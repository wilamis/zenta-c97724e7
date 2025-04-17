
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
import { ScrollArea } from "../ui/scroll-area";

const KanbanBoard = () => {
  const { t } = useLanguage();
  
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
    handleDeleteColumn,
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
    setDraggedColumnId(columnId);
    handleColumnDragStart(e, columnId);
  };

  const onColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
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
      <div className="flex justify-end items-center mb-4 w-full">
        <Button 
          onClick={handleOpenAddTaskModal}
          className="flex items-center gap-2 bg-[#9b87f5] hover:bg-[#8B5CF6] transition-colors"
          size="default"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">{t('tasks.addTask')}</span>
        </Button>
      </div>
      
      <ScrollArea className="kanban-board-container h-[700px] w-full max-w-full flex items-center justify-center">
        <div className="flex gap-4 w-max pb-4 pr-6 mx-auto">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              onRename={handleRenameColumn}
              onDelete={handleDeleteColumn}
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
