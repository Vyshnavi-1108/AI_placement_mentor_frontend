import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { 
  CheckSquare, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  TrendingUp,
  CalendarDays
} from "lucide-react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, streakRes] = await Promise.all([
        api.get("/api/tasks"),
        api.get("/api/tasks/streak")
      ]);
      setTasks(tasksRes.data);
      setStreak(streakRes.data.streak);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/complete`);
      setTasks(tasks.map(t => t.id === taskId ? res.data : t));
      toast.success("Task updated successfully!");

      // Update streak count
      const streakRes = await api.get("/api/tasks/streak");
      setStreak(streakRes.data.streak);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.is_completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <CheckSquare className="h-7 w-7 text-emerald-400" />
            Daily Tasks
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete your daily tasks to stay on track and maintain your preparation streak.
          </p>
        </div>

        {/* Streak card */}
        <div className="flex items-center gap-3.5 bg-orange-500/10 border border-orange-500/20 px-5 py-3 rounded-2xl">
          <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 animate-pulse">
            <Flame className="h-5.5 w-5.5 fill-current" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Current Streak</p>
            <h4 className="text-lg font-black text-white">{streak} Day{streak !== 1 && 's'}</h4>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Tasks list */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-slate-400" />
              Preparation Tasks for Today
            </h3>
            <span className="text-xs text-slate-500 font-semibold uppercase">{new Date().toDateString()}</span>
          </div>

          <div className="space-y-3.5">
            {tasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                No preparation tasks created for today.
              </div>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                    task.is_completed 
                      ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400" 
                      : "bg-slate-900/40 border-slate-900 text-slate-200 hover:border-slate-800"
                  }`}
                >
                  <button className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors">
                    {task.is_completed ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 fill-current" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <h4 className={`font-bold text-sm sm:text-base ${task.is_completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{task.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Task Progress Card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Goal Progress
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-400">Task Completion Rate</span>
                <span className="text-emerald-400">{completionRate}%</span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                Completing 100% of your daily objectives pushes your placement readiness higher and strengthens your daily discipline streak.
              </p>
            </div>
          </div>

          {/* Motivational Tip Card */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none"></div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
              Preparation Advice
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintain daily preparation streaks. Employers value consistent self-improvement. Spend time reviewing weak topics and coding daily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
