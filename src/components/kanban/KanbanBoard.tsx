
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import KanbanColumn from "./KanbanColumn";
import AddColumnDialog from "./AddColumnDialog";
import TaskModal from "../tasks/TaskModal";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import { useKanbanColumns } from "./useKanbanColumns";
import { useKanbanTasks } from "./useKanbanTasks";
import { useKanbanDragDrop } from "./useKanbanDragDrop";

const KanbanBoard = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Manage Columns</h2>
        <Button 
          onClick={() => setIsAddColumnOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span className="tracking-normal">Add Column</span>
        </Button>
      </div>
      
      <div className="kanban-board flex gap-6 overflow-x-auto pb-6 pt-2 min-h-[70vh]">
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
