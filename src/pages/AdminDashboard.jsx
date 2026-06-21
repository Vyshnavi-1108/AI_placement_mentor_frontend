import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import { 
  ShieldAlert, 
  Users, 
  Award, 
  CheckSquare, 
  Send, 
  Star, 
  TrendingUp, 
  Mail,
  Calendar
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, feedbackRes] = await Promise.all([
        api.get("/api/admin/analytics"),
        api.get("/api/admin/feedback")
      ]);
      setStats(statsRes.data);
      setFeedback(feedbackRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          <ShieldAlert className="h-7 w-7 text-emerald-400" />
          Admin Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor general platform utilization, active students, and feedback.
        </p>
      </div>

      {/* Grid: 5 Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Users */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Users</p>
            <h3 className="text-xl font-black text-white mt-0.5">{stats?.total_users}</h3>
          </div>
        </div>

        {/* Total Interviews */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Interviews Done</p>
            <h3 className="text-xl font-black text-white mt-0.5">{stats?.total_interviews}</h3>
          </div>
        </div>

        {/* Avg Score */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Avg Mock Score</p>
            <h3 className="text-xl font-black text-white mt-0.5">{stats?.avg_interview_score}%</h3>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Tasks Solved</p>
            <h3 className="text-xl font-black text-white mt-0.5">{stats?.total_tasks_completed}</h3>
          </div>
        </div>

        {/* Feedback Count */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Feedbacks</p>
            <h3 className="text-xl font-black text-white mt-0.5">{stats?.feedback_count}</h3>
          </div>
        </div>
      </div>

      {/* Feedback Comments section */}
      <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 border-b border-slate-900 pb-3">
          <Send className="h-5 w-5 text-emerald-400" />
          User Feedback Submissions
        </h3>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {feedback.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No feedback submitted yet.
            </div>
          ) : (
            feedback.map(fb => (
              <div 
                key={fb.id}
                className="bg-slate-950/60 border border-slate-900 p-5 rounded-2xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/60 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase">
                      {fb.user_name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{fb.user_name}</h4>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {fb.user_email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                      <Calendar className="h-3 w-3" />
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg text-amber-400 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {fb.rating} / 5
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{(fb.comment)}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
