
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen">
        <div className="container mx-auto py-6 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
