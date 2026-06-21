import { useEffect, useState } from "react";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Compass, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

function RoadmapPage() {
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchRoadmap = async (forceRegenerate = false) => {
    try {
      if (forceRegenerate) {
        setRegenerating(true);
      } else {
        setLoading(true);
      }
      
      const response = await api.get(forceRegenerate ? "/api/roadmap/generate?regenerate=true" : "/api/roadmap/generate");
      setRoadmap(response.data.roadmap);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate placement roadmap.");
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Compass className="h-7 w-7 text-emerald-400" />
            AI Placement Roadmap
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Your customized preparation milestones and preparation schedules.
          </p>
        </div>

        <button
          onClick={() => fetchRoadmap(true)}
          disabled={loading || regenerating}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 px-4 py-2.5 font-semibold text-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
          {regenerating ? "Regenerating..." : "Regenerate Roadmap"}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col h-[50vh] items-center justify-center gap-4">
          <Loader size="lg" />
          <p className="text-slate-400 text-sm animate-pulse">Generating your custom roadmap with Gemini...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Disclaimer Banner */}
          <div className="flex gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3.5 text-sm text-emerald-400">
            <Sparkles className="h-5 w-5 flex-shrink-0" />
            <p>
              This roadmap is customized based on your onboarding preferences. Review the milestones and work on the checklist daily.
            </p>
          </div>

          {/* Roadmap Content Card */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-8 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none"></div>
            
            {/* Styled Roadmap Output */}
            <article className="prose prose-invert max-w-none prose-headings:text-white prose-h1:text-2xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-bold prose-h2:text-emerald-400 prose-h3:text-lg prose-p:text-slate-400 prose-p:leading-relaxed prose-li:text-slate-300 prose-ul:list-disc prose-ol:list-decimal prose-strong:text-white border-l border-slate-800 pl-4 sm:pl-6 space-y-4">
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoadmapPage;
