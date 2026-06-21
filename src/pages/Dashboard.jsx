import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { 
  Flame, 
  Compass, 
  Calendar, 
  CheckCircle2, 
  Circle,
  TrendingUp, 
  Award, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both dashboard analytics and tasks in parallel
      const [analyticsRes, tasksRes] = await Promise.all([
        api.get("/api/analytics/dashboard"),
        api.get("/api/tasks")
      ]);
      setAnalytics(analyticsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Dashboard load failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/complete`);
      // Update local task state
      setTasks(tasks.map(t => t.id === taskId ? res.data : t));
      toast.success("Task status updated!");
      
      // Refresh dashboard analytics silently (to update readiness/streak)
      const analyticsRes = await api.get("/api/analytics/dashboard");
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Get max completed tasks in weekly consistency to scale the bars
  const maxWeeklyTasks = analytics ? Math.max(...analytics.weekly_consistency.map(d => d.completed), 1) : 1;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Section: Greeting, Readiness & Streak */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Welcome Card */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-slate-900 bg-slate-900/40 p-8 backdrop-blur-md flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-40 w-40 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none"></div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-slate-400 text-sm max-w-md">
              Here is your placement dashboard. Take control of today's tasks and check your analytics to track your placement status.
            </p>
          </div>
          <div className="mt-8 flex gap-3">
            <Link
              to="/roadmap"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.02]"
            >
              Study Roadmap
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white px-5 py-2.5 font-bold text-sm transition-all"
            >
              Ask AI Mentor
            </Link>
          </div>
        </div>

        {/* Readiness and Streak widgets */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-1">
          {/* Readiness Score circular widget */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between items-center text-center">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">
              Readiness Score
            </span>
            <div className="relative flex items-center justify-center my-2">
              {/* Circular gauge */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="48" 
                  cy="48" 
                  r="40" 
                  stroke="#10b981" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * (analytics?.readiness_score || 0)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">{analytics?.readiness_score}%</span>
              </div>
            </div>
            <span className="text-xs text-slate-500 mt-1">Updated based on mock stats</span>
          </div>

          {/* Streak widget */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between items-center text-center">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">
              Learning Streak
            </span>
            <div className="flex items-center justify-center my-3 relative">
              <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 animate-pulse">
                <Flame className="h-9 w-9 fill-current" />
              </div>
              <span className="absolute text-xl font-black text-white">{analytics?.study_streak}</span>
            </div>
            <span className="text-xs text-slate-500 mt-1">Keep it up! Keep learning</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Daily tasks & Mentor insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Tasks Card */}
        <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Today's Objectives
              </h2>
              <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full">
                {analytics?.tasks_completed} of {analytics?.tasks_total} completed
              </span>
            </div>

            <div className="space-y-3.5 my-4">
              {tasks.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm">
                  No tasks generated for today. Wait a moment...
                </div>
              ) : (
                tasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      task.is_completed 
                        ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400" 
                        : "bg-slate-950/60 border-slate-900 text-slate-200 hover:border-slate-800"
                    }`}
                  >
                    <button className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors">
                      {task.is_completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-current" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <h4 className={`font-semibold text-sm ${task.is_completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-900 flex justify-end">
            <Link to="/tasks" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Manage preparation tasks
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* AI Mentor Insights & Weekly consistency */}
        <div className="grid gap-6">
          {/* AI Mentor Insights */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none"></div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Mentor Insights
            </h2>
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4">
              <p className="text-sm text-emerald-300/90 leading-relaxed font-medium italic">
                "{analytics?.mentor_insights}"
              </p>
            </div>
          </div>

          {/* Weekly consistency chart */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-emerald-400" />
              Preparation Consistency
            </h2>
            <div className="flex h-36 items-end justify-between px-2 pt-6 border-b border-slate-900">
              {analytics?.weekly_consistency.map((day) => {
                const percentage = (day.completed / maxWeeklyTasks) * 100;
                return (
                  <div key={day.day} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="relative w-full h-24 flex items-end justify-center">
                      {/* Tooltip */}
                      <span className="absolute -top-7 scale-0 group-hover:scale-100 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-100 transition-all z-10">
                        {day.completed} task{day.completed !== 1 && 's'}
                      </span>
                      <div 
                        className="w-6 sm:w-8 bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-lg transition-all duration-500 hover:opacity-85"
                        style={{ height: `${Math.max(percentage, 5)}%`, minHeight: '6px' }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 group-hover:text-slate-300 font-medium">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: AI Recommendations */}
      <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          Recommended Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link 
            to="/interview" 
            className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded-2xl group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-200">Start Mock Interview</h4>
                <p className="text-xs text-slate-500 mt-0.5">Practice Technical/HR answers</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </Link>

          <Link 
            to="/chat" 
            className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded-2xl group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-200">Ask Career Question</h4>
                <p className="text-xs text-slate-500 mt-0.5">Solve doubts with AI mentor</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </Link>

          <Link 
            to="/roadmap" 
            className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded-2xl group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <Compass className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-200">Inspect Roadmap</h4>
                <p className="text-xs text-slate-500 mt-0.5">Track preparation milestones</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
