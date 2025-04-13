
import Layout from "@/components/layout/Layout";
import KanbanBoard from "@/components/kanban/KanbanBoard";

const Kanban = () => {
  return (
    <Layout>
      <div className="container py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>
        <KanbanBoard />
      </div>
    </Layout>
  );
};

export default Kanban;
