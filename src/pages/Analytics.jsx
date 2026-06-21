import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  Clock, 
  Flame, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/analytics/dashboard");
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const maxWeeklyTasks = data ? Math.max(...data.weekly_consistency.map(d => d.completed), 1) : 1;

  // Construct SVG points for the line chart if scores exist
  let svgPoints = "";
  const scoresCount = data?.interview_scores.length || 0;
  if (scoresCount > 0) {
    const width = 500;
    const height = 150;
    const padding = 20;
    
    const xStep = scoresCount > 1 ? (width - padding * 2) / (scoresCount - 1) : 0;
    
    data.interview_scores.forEach((item, index) => {
      const x = padding + index * xStep;
      // invert y since SVG y starts from top (score ranges from 0 to 100)
      const y = height - padding - ((item.score) / 100) * (height - padding * 2);
      svgPoints += `${x},${y} `;
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-emerald-400" />
          Preparation Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Detailed metrics charting your placement preparedness and study routines.
        </p>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Readiness */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Readiness Score</p>
            <h3 className="text-xl font-black text-white mt-0.5">{data?.readiness_score}%</h3>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400">
            <Flame className="h-5 w-5 fill-current" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Study Streak</p>
            <h3 className="text-xl font-black text-white mt-0.5">{data?.study_streak} Days</h3>
          </div>
        </div>

        {/* Tasks completed */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Tasks Completed Today</p>
            <h3 className="text-xl font-black text-white mt-0.5">
              {data?.tasks_completed} of {data?.tasks_total}
            </h3>
          </div>
        </div>

        {/* Interviews completed */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Mock Interviews</p>
            <h3 className="text-xl font-black text-white mt-0.5">{data?.interviews_completed} Completed</h3>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* SVG Interview Score Progression Line Chart */}
        <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Interview Score Progression
            </h3>
            
            {scoresCount === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
                No mock scores logged yet. Start an interview to record performance metrics.
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <svg className="w-full h-44 mt-4" viewBox="0 0 500 150">
                  {/* Grid lines */}
                  <line x1="20" y1="20" x2="480" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="4" />
                  <line x1="20" y1="75" x2="480" y2="75" stroke="#1e293b" strokeWidth="1" strokeDasharray="4" />
                  <line x1="20" y1="130" x2="480" y2="130" stroke="#1e293b" strokeWidth="1" strokeDasharray="4" />
                  
                  {/* Line path */}
                  {svgPoints && (
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      points={svgPoints}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Draw points & labels */}
                  {data.interview_scores.map((item, index) => {
                    const width = 500;
                    const height = 150;
                    const padding = 20;
                    const xStep = scoresCount > 1 ? (width - padding * 2) / (scoresCount - 1) : 0;
                    const x = padding + index * xStep;
                    const y = height - padding - ((item.score) / 100) * (height - padding * 2);

                    return (
                      <g key={index}>
                        <circle cx={x} cy={y} r="5" fill="#10b981" stroke="#0b0f19" strokeWidth="2" />
                        <text x={x} y={y - 10} fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
                          {item.score}
                        </text>
                        <text x={x} y={height - 2} fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">
                          {item.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500 mt-4 block">Preparation scores charted sequentially.</span>
        </div>

        {/* Weekly consistency bar chart */}
        <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
          <h3 className="font-bold text-white text-base flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
            <Calendar className="h-5 w-5 text-emerald-400" />
            Weekly Task Consistency
          </h3>
          
          <div className="flex h-44 items-end justify-between px-2 pt-6 border-b border-slate-900">
            {data.weekly_consistency.map((day) => {
              const percentage = (day.completed / maxWeeklyTasks) * 100;
              return (
                <div key={day.day} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="relative w-full h-28 flex items-end justify-center">
                    <span className="absolute -top-7 scale-0 group-hover:scale-100 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-100 transition-all z-10">
                      {day.completed} completed
                    </span>
                    <div 
                      className="w-7 sm:w-9 bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-lg transition-all duration-500 hover:opacity-85"
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

      {/* Skills progress section */}
      <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
        <h3 className="font-bold text-white text-base flex items-center gap-2 mb-6 border-b border-slate-900 pb-3">
          <Target className="h-5 w-5 text-emerald-400" />
          Skill Proficiency Breakdown
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          {Object.entries(data?.skill_progress || {}).map(([skill, progress]) => (
            <div key={skill} className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-200">
                <span>{skill}</span>
                <span className="text-emerald-400">{progress}%</span>
              </div>
              
              <div className="w-full bg-slate-900 border border-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
