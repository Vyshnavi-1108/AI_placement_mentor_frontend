import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Compass, Sparkles, BookOpen, Clock, Calendar, ArrowRight, ArrowLeft, Terminal } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const { refreshOnboardingStatus } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    target_role: "",
    skill_level: "Intermediate",
    weak_areas: "",
    daily_study_hours: "",
    placement_timeline: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectSkill = (level) => {
    setFormData({ ...formData, skill_level: level });
  };

  const nextStep = () => {
    if (step === 1 && !formData.target_role.trim()) {
      toast.error("Please enter a target role");
      return;
    }
    if (step === 2 && !formData.weak_areas.trim()) {
      toast.error("Please specify your weak areas");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }
    
    // Validate Step 3 fields
    if (formData.daily_study_hours === "" || formData.daily_study_hours === null || formData.daily_study_hours === undefined) {
      toast.error("Please enter daily study hours");
      return;
    }
    const hours = Number(formData.daily_study_hours);
    if (isNaN(hours) || hours < 1 || hours > 16) {
      toast.error("Daily study hours must be a number between 1 and 16");
      return;
    }

    if (!formData.placement_timeline || formData.placement_timeline.toString().trim() === "") {
      toast.error("Please enter placement timeline");
      return;
    }
    const timeline = Number(formData.placement_timeline);
    if (isNaN(timeline) || timeline < 1 || timeline > 24) {
      toast.error("Placement timeline must be a number between 1 and 24 months");
      return;
    }

    try {
      await api.post("/api/onboarding", formData);
      toast.success("Placement profile saved successfully!");
      await refreshOnboardingStatus();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500 selection:text-slate-900">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-5xl bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-8 relative z-10">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center">
          <Terminal className="h-5 w-5 text-slate-950 font-bold" />
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Mentor.AI
        </span>
      </div>

      <div className="w-full max-w-xl bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md relative z-10 shadow-2xl">
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Compass className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">Target Career & Skill Level</h2>
                <p className="text-slate-400 text-sm">Tell us about your desired job role and current technical proficiency.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Job Role</label>
                <input
                  name="target_role"
                  placeholder="e.g. Full Stack Engineer, Data Analyst, iOS Developer"
                  value={formData.target_role}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Self-Assessed Skill Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => selectSkill(level)}
                      className={`p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                        formData.skill_level === level
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/5"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">Areas of Focus</h2>
                <p className="text-slate-400 text-sm">Mention weak concepts or subjects you want your mentor to prioritize.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Weak Areas & Topics</label>
                <textarea
                  name="weak_areas"
                  rows={4}
                  placeholder="e.g. Dynamic Programming, SQL joins, System Design caching, Binary trees"
                  value={formData.weak_areas}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">Preparation Timeline</h2>
                <p className="text-slate-400 text-sm">Define your learning availability and upcoming placement window.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    Daily Study Hours
                  </label>
                  <input
                    type="number"
                    name="daily_study_hours"
                    min={1}
                    max={16}
                    value={formData.daily_study_hours}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    Placement Timeline (Months)
                  </label>
                  <input
                    type="number"
                    name="placement_timeline"
                    min={1}
                    max={24}
                    value={formData.placement_timeline}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800/40">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.02]"
              >
                Complete Onboarding
                <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
