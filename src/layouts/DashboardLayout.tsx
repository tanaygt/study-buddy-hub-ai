
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  BarChart, 
  LogOut,
  Menu
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, href, isActive }: SidebarItemProps) => (
  <Link to={href}>
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "w-full justify-start gap-2",
        isActive ? "bg-study-600 hover:bg-study-700" : ""
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          {sidebarOpen && <div className="font-bold gradient-text">Study Buddy Hub</div>}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn(!sidebarOpen && "mx-auto")}>
            <Menu />
          </Button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <SidebarItem
            icon={<Users size={20} />}
            label={sidebarOpen ? "Study Group" : ""}
            href="/dashboard/study-group"
            isActive={isActive("/dashboard/study-group")}
          />
          <SidebarItem
            icon={<MessageSquare size={20} />}
            label={sidebarOpen ? "Chat Tutor" : ""}
            href="/dashboard/chat-tutor"
            isActive={isActive("/dashboard/chat-tutor")}
          />
          <SidebarItem
            icon={<BookOpen size={20} />}
            label={sidebarOpen ? "Flashcards" : ""}
            href="/dashboard/flashcards"
            isActive={isActive("/dashboard/flashcards")}
          />
          <SidebarItem
            icon={<BarChart size={20} />}
            label={sidebarOpen ? "Progress" : ""}
            href="/dashboard/progress"
            isActive={isActive("/dashboard/progress")}
          />
        </nav>
        <div className="p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Log Out</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex items-center">
          <h1 className="text-xl font-semibold">
            {location.pathname.includes("study-group") && "Study Group Chat"}
            {location.pathname.includes("chat-tutor") && "Chat Tutor"}
            {location.pathname.includes("flashcards") && "Smart Flashcards"}
            {location.pathname.includes("progress") && "Progress Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {user?.email}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
