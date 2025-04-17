
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
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Initialize column operations
  const {
    handleAddColumn,
    handleDeleteColumn,
    handleRenameColumn,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop
  } = useKanbanColumns({ columns, setColumns, toast });

  // Initialize task operations
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

  // Initialize drag and drop operations
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

  // Column drag start with state update
  const onColumnDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumnId(columnId);
    handleColumnDragStart(e, columnId);
  };

  // Column drop with draggedColumnId state clearing
  const onColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    handleColumnDrop(e, targetColumnId, draggedColumnId);
    setDraggedColumnId(null);
  };

  // Function to open the task modal with the first column as default if no active column is set
  const handleOpenAddTaskModal = () => {
    if (!activeColumn && columns.length > 0) {
      setActiveColumn(columns[0].id);
    }
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">{t('kanban.manageColumns')}</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleOpenAddTaskModal}
            className="flex items-center gap-1"
            variant="default"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="tracking-normal">{t('tasks.addTask')}</span>
          </Button>
          <Button 
            onClick={() => setIsAddColumnOpen(true)}
            className="flex items-center gap-1"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="tracking-normal">{t('kanban.addColumn')}</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="kanban-board-container h-[calc(100vh-180px)]" orientation="horizontal">
        <div className="flex gap-4 pb-4 min-w-fit">
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
      
      {isAddColumnOpen && (
        <AddColumnDialog
          isOpen={isAddColumnOpen}
          onClose={() => setIsAddColumnOpen(false)}
          onAddColumn={handleAddColumn}
        />
      )}
      
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setActiveColumn(null);
          }}
          onSave={handleTaskSave}
          task={editingTask || undefined}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
