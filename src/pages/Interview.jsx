import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { 
  Award, 
  Play, 
  ArrowRight, 
  HelpCircle, 
  ArrowLeft,
  Calendar,
  CheckSquare,
  History,
  Sparkles,
  ChevronRight
} from "lucide-react";

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [activeInterview, setActiveInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form selections for new interview
  const [type, setType] = useState("Technical");

  // Active session status
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", "", ""]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/interviews/history");
      setInterviews(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleStart = async () => {
    try {
      setSubmitting(true);
      const res = await api.post("/api/interviews/start", { type });
      setActiveInterview(res.data);
      setCurrentQuestionIndex(0);
      setAnswers(["", "", "", "", ""]);
      toast.success("Interview started! Good luck.");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerChange = (text) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = text;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[currentQuestionIndex].trim()) {
      toast.error("Please answer the current question.");
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrev = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmit = async () => {
    if (!answers[currentQuestionIndex].trim()) {
      toast.error("Please answer the final question.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post(`/api/interviews/${activeInterview.id}/submit`, {
        answers
      });
      setActiveInterview(res.data);
      toast.success("Interview evaluated successfully!");
      // Reload history list
      const histRes = await api.get("/api/interviews/history");
      setInterviews(histRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const viewPreviousSession = async (interviewId) => {
    try {
      setSubmitting(true);
      const res = await api.get(`/api/interviews/${interviewId}`);
      setActiveInterview(res.data);
      // scroll to top of panel
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Award className="h-7 w-7 text-emerald-400" />
            Mock AI Interviews
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Conduct placement mock sessions and receive detailed constructive feedback on your answers.
          </p>
        </div>

        {activeInterview && (
          <button
            onClick={() => setActiveInterview(null)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 hover:text-white px-4 py-2 text-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit Session
          </button>
        )}
      </div>

      {submitting ? (
        <div className="flex flex-col h-[50vh] items-center justify-center gap-4">
          <Loader size="lg" />
          <p className="text-slate-400 text-sm animate-pulse">AI is conducting review and scoring your interview...</p>
        </div>
      ) : activeInterview ? (
        /* Active Interview Panel */
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Question & Answer Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeInterview.status === "pending" ? (
              /* Ongoing Interview */
              <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                
                {/* Progress bar */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                  <span>Question {currentQuestionIndex + 1} of 5</span>
                  <span className="text-emerald-400">{activeInterview.type} Round</span>
                </div>
                
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                  ></div>
                </div>

                {/* Question */}
                <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 flex items-start gap-3">
                  <HelpCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="font-bold text-slate-100 leading-relaxed text-sm sm:text-base">
                    {activeInterview.questions?.[currentQuestionIndex]}
                  </p>
                </div>

                {/* Input Textarea */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Your Response</label>
                  <textarea
                    rows={6}
                    placeholder="Type your detailed response here..."
                    value={answers[currentQuestionIndex]}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm leading-relaxed"
                  />
                </div>

                {/* Navigation controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-900">
                  {currentQuestionIndex > 0 ? (
                    <button
                      onClick={handlePrev}
                      className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Prev
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {currentQuestionIndex < 4 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold transition-all hover:scale-[1.02]"
                    >
                      Submit Mock Answers
                      <Award className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Completed Interview Feedback */
              <div className="space-y-6 animate-fade-in">
                {/* Score Widget */}
                <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-8 flex flex-col sm:flex-row items-center gap-6 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-28 w-28 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none"></div>
                  
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="46" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="46" 
                        stroke="#10b981" 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={289}
                        strokeDashoffset={289 - (289 * (activeInterview.score || 0)) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-3xl font-black text-white">{activeInterview.score}%</span>
                  </div>

                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-white">AI Evaluation Score</h3>
                    <p className="text-slate-400 text-sm">
                      Your performance graded for {activeInterview.type} interview criteria. Review areas of improvement below.
                    </p>
                  </div>
                </div>

                {/* AI Review Report */}
                <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-8 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    AI Feedback Report
                  </h3>
                  <article className="prose prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-h3:text-emerald-400 prose-li:text-slate-300">
                    <ReactMarkdown>{activeInterview.feedback}</ReactMarkdown>
                  </article>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Q&A List Summary / Session Info */}
          <div className="space-y-6">
            {activeInterview.status === "completed" && (
              <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-900 pb-2">
                  <CheckSquare className="h-4.5 w-4.5 text-emerald-400" />
                  Response Sheet
                </h4>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {activeInterview.questions?.map((q, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-900/60 p-3 rounded-xl space-y-1">
                      <p className="text-xs font-bold text-emerald-400">Q{idx + 1}: {q}</p>
                      <p className="text-xs text-slate-400 italic">"{(activeInterview.answers?.[idx] || "[No Answer]")}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 text-center space-y-4">
              <h4 className="font-bold text-white text-sm border-b border-slate-900 pb-2">Interview Details</h4>
              <div className="text-xs text-slate-400 space-y-2 text-left">
                <p><span className="font-semibold text-slate-300">Session ID:</span> #{activeInterview.id}</p>
                <p><span className="font-semibold text-slate-300">Type:</span> {activeInterview.type}</p>
                <p><span className="font-semibold text-slate-300">Status:</span> <span className={activeInterview.status === "completed" ? "text-emerald-400" : "text-orange-400"}>{activeInterview.status}</span></p>
                <p><span className="font-semibold text-slate-300">Date:</span> {new Date(activeInterview.created_at).toLocaleString()}</p>
              </div>
              {activeInterview.status === "completed" && (
                <button
                  onClick={() => setActiveInterview(null)}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white p-3 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors text-xs font-bold"
                >
                  Start New Session
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* New Session Setup / History listing */
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* New Interview Panel */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between backdrop-blur-md">
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
                <Play className="h-5 w-5 text-emerald-400" />
                Start Simulation
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Round Type</label>
                  <div className="space-y-2">
                    {["Technical", "HR", "Mixed"].map(rType => (
                      <button
                        key={rType}
                        type="button"
                        onClick={() => setType(rType)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                          type === rType
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/5"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {rType} Round
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                  The AI mentor will generate 5 specific placement questions. Take your time to write comprehensive answers.
                </p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-4 rounded-xl font-bold shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.01] mt-6"
            >
              Initiate Simulation
            </button>
          </div>

          {/* History Panel */}
          <div className="md:col-span-2 rounded-3xl border border-slate-900 bg-slate-900/40 p-6 backdrop-blur-md">
            <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
              <History className="h-5 w-5 text-slate-400" />
              Interview Log History
            </h3>

            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {interviews.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  You haven't completed any mock interviews yet.
                </div>
              ) : (
                interviews.map(intv => (
                  <div
                    key={intv.id}
                    onClick={() => viewPreviousSession(intv.id)}
                    className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded-2xl cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-slate-200">{intv.type} Interview</h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(intv.created_at).toLocaleDateString()}
                          </span>
                          <span className={intv.status === "completed" ? "text-emerald-500/80 font-bold" : "text-orange-400"}>
                            {intv.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {intv.status === "completed" && (
                        <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-bold text-slate-300">
                          Score: <span className="text-emerald-400">{intv.score}%</span>
                        </div>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
