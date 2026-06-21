import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ArrowRight, Terminal, Award, Compass, MessageSquareCode, CheckSquare, ShieldCheck } from "lucide-react";

const Landing = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full max-w-7xl bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-6 border-b border-slate-900/60 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Terminal className="h-5 w-5 text-slate-950 font-bold" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Mentor.AI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {token ? (
            <Link
              to="/dashboard"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.02]"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6">
          <SparklesIcon className="h-4 w-4" />
          The Next Generation Placement Prep Platform
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl">
          Accelerate Your Placement Readiness with{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Personalized AI Mentorship
          </span>
        </h1>
        
        <p className="text-slate-400 text-base sm:text-xl mt-6 max-w-2xl leading-relaxed">
          Create AI-guided learning roadmaps, complete curated daily tasks, track streaks, and conduct realistic mock interviews with real-time feedback.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link
            to={token ? "/dashboard" : "/register"}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-xl font-bold shadow-xl shadow-emerald-500/15 transition-all hover:scale-[1.03] group"
          >
            Start Preparedness Roadmap
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to={token ? "/dashboard" : "/login"}
            className="border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-bold transition-all"
          >
            Access My Mentor
          </Link>
        </div>

        {/* Features Showcase Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-24 text-left">
          <div className="border border-slate-900/80 bg-slate-950/40 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Guided Roadmaps</h3>
            <p className="text-sm text-slate-400">Custom learning pathways generated based on your target career goals, weaknesses, and timeline.</p>
          </div>

          <div className="border border-slate-900/80 bg-slate-950/40 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Curated Daily Tasks</h3>
            <p className="text-sm text-slate-400">Actionable preparation objectives delivered every morning. Complete goals to maintain your study streak.</p>
          </div>

          <div className="border border-slate-900/80 bg-slate-950/40 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mock AI Interviews</h3>
            <p className="text-sm text-slate-400">Realistic Technical, HR, and Mixed interview sessions containing customized questions and grading.</p>
          </div>

          <div className="border border-slate-900/80 bg-slate-950/40 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <MessageSquareCode className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Mentor Chat</h3>
            <p className="text-sm text-slate-400">Real-time placement questions, coding support, and resume reviews streamed character-by-character.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500 mt-20 z-10">
        <p>© 2026 Mentor.AI Placement Prep. Built for developers. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

// Simple Sparkles SVG Icon
const SparklesIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5 5 3Z" />
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
  </svg>
);

export default Landing;
