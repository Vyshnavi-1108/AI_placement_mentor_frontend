import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Lock, Trash2, Mail, ShieldAlert, Award, Flame, UserCheck } from "lucide-react";

const AdminUsers = () => {
  const { user: loggedInAdmin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (userId === loggedInAdmin.id) {
      toast.error("You cannot delete your own admin account.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${userName}"? All their data (profile, chat logs, mock interviews, streaks) will be permanently erased.`)) {
      return;
    }

    try {
      setDeletingId(userId);
      await api.delete(`/api/admin/users/${userId}`);
      toast.success(`User "${userName}" deleted successfully.`);
      // Filter out deleted user from list
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Lock className="h-7 w-7 text-emerald-400" />
          User Administration
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review candidate onboarding statuses and manage platform accounts.
        </p>
      </div>

      {/* Users table */}
      <div className="rounded-3xl border border-slate-900 bg-slate-900/40 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4.5">Candidate</th>
                <th className="px-6 py-4.5">Role / Target</th>
                <th className="px-6 py-4.5 text-center">Readiness</th>
                <th className="px-6 py-4.5 text-center">Streak</th>
                <th className="px-6 py-4.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-sm">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    No users registered on the platform.
                  </td>
                </tr>
              ) : (
                users.map(user => {
                  const isSelf = user.id === loggedInAdmin?.id;
                  
                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-slate-900/20 transition-colors ${
                        isSelf ? "bg-emerald-500/5 hover:bg-emerald-500/5" : ""
                      }`}
                    >
                      {/* Candidate Column */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-emerald-400 border border-slate-700/60 uppercase">
                          {user.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                            {user.name}
                            {isSelf && (
                              <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-[9px] text-emerald-400 font-bold uppercase">
                                You
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </td>

                      {/* System Role / Placement Target Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            user.role === "admin" 
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-slate-400 text-xs font-semibold">
                            {user.profile?.target_role ? `→ ${user.profile.target_role}` : "• Onboarding Pending"}
                          </span>
                        </div>
                        {user.profile && (
                          <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold tracking-wider">
                            Level: {user.profile.skill_level}
                          </p>
                        )}
                      </td>

                      {/* Readiness gauge column */}
                      <td className="px-6 py-4 text-center">
                        {user.profile ? (
                          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-emerald-400 font-black text-xs">
                            <Award className="h-3.5 w-3.5" />
                            {user.profile.readiness_score}%
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">--</span>
                        )}
                      </td>

                      {/* Streak column */}
                      <td className="px-6 py-4 text-center">
                        {user.profile ? (
                          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-xl text-orange-400 font-bold text-xs">
                            <Flame className="h-3.5 w-3.5 fill-current" />
                            {user.profile.streak} Days
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">--</span>
                        )}
                      </td>

                      {/* Delete actions column */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={isSelf || deletingId === user.id}
                          className="p-2 rounded-xl border border-slate-900 bg-slate-950/60 hover:bg-red-500/10 hover:border-red-500/30 text-slate-500 hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isSelf ? "Cannot delete yourself" : `Delete ${user.name}`}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
