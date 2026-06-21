import { useState, useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  LayoutDashboard,
  MessageSquare,
  Map,
  CheckSquare,
  Award,
  BarChart3,
  Send,
  User,
  ShieldAlert,
  LogOut,
  X,
  Lock
} from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/chat", label: "AI Mentor Chat", icon: MessageSquare },
    { to: "/roadmap", label: "AI Roadmap", icon: Map },
    { to: "/tasks", label: "Daily Tasks", icon: CheckSquare },
    { to: "/interview", label: "Mock Interviews", icon: Award },
    { to: "/analytics", label: "My Analytics", icon: BarChart3 },
    { to: "/profile", label: "My Profile", icon: User },
    { to: "/feedback", label: "Submit Feedback", icon: Send },
  ];

  const adminLinks = [
    { to: "/admin", label: "Admin Stats", icon: ShieldAlert },
    { to: "/admin/users", label: "Manage Users", icon: Lock },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderLinks = (linksList) => {
    return linksList.map((link) => {
      const Icon = link.icon;
      return (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {link.label}
        </NavLink>
      );
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar Panel for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-900 bg-slate-950 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-900 bg-slate-950">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              Mentor.AI
            </span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto space-y-1.5 px-4 py-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">
            Preparation Modules
          </div>
          {renderLinks(navLinks)}

          {/* Admin Block */}
          {user?.role === "admin" && (
            <div className="mt-8">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">
                Administration
              </div>
              {renderLinks(adminLinks)}
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-900 p-4 bg-slate-950">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Window */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onToggleSidebar={toggleSidebar} />
        
        {/* Child Router Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-950 px-6 py-8 md:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
