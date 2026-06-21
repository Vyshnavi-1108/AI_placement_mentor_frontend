import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, User, LogOut, ChevronDown, Bell, Shield } from "lucide-react";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
          aria-label="Toggle Sidebar"
          id="sidebar-toggle-btn"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            Mentor.AI
          </span>
        </Link>
      </div>

      {/* Right: Notifications & Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Admin Badge */}
        {user?.role === "admin" && (
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20 md:flex">
            <Shield className="h-3 w-3" />
            Admin Portal
          </span>
        )}

        {/* Notifications Icon */}
        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-900 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full p-1.5 text-slate-300 hover:bg-slate-900 hover:text-white focus:outline-none"
            id="user-profile-menu-btn"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 font-bold text-emerald-400 ring-2 ring-slate-800">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="hidden text-sm font-medium md:block">
              {user?.name || "User"}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none z-20">
                <div className="px-3 py-2 border-b border-slate-800/60 mb-1">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
