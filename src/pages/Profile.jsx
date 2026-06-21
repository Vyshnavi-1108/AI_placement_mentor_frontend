import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { User, Compass, Calendar, Clock, BookOpen, Save, Shield } from "lucide-react";

const Profile = () => {
  const { user, refreshOnboardingStatus } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    target_role: "",
    skill_level: "Intermediate",
    weak_areas: "",
    daily_study_hours: 4,
    placement_timeline: "3",
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/onboarding");
      setFormData({
        target_role: res.data.target_role || "",
        skill_level: res.data.skill_level || "Intermediate",
        weak_areas: res.data.weak_areas || "",
        daily_study_hours: res.data.daily_study_hours || 4,
        placement_timeline: res.data.placement_timeline || "3",
      });
    } catch (error) {
      console.error(error);
      // Profile might not exist yet, which is fine
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectSkill = (level) => {
    setFormData({ ...formData, skill_level: level });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.target_role.trim()) {
      toast.error("Please enter a target role");
      return;
    }
    if (!formData.weak_areas.trim()) {
      toast.error("Please specify your weak areas");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/api/onboarding", formData);
      toast.success("Profile preferences updated!");
      await refreshOnboardingStatus();
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
    <div className="space-y-8 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <User className="h-7 w-7 text-emerald-400" />
          My Profile
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review your account parameters and change preparation target metrics.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Account Card */}
        <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
          <h3 className="font-bold text-white text-base border-b border-slate-900 pb-2">Account Metadata</h3>
          <div className="grid gap-4 sm:grid-cols-2 text-sm text-slate-400">
            <div>
              <span className="font-semibold text-slate-500">Name:</span>
              <p className="text-slate-200 font-semibold mt-0.5">{user?.name}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Email:</span>
              <p className="text-slate-200 font-semibold mt-0.5">{user?.email}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Role:</span>
              <p className="text-slate-200 font-semibold mt-0.5 flex items-center gap-1.5 capitalize">
                {user?.role === "admin" && <Shield className="h-4 w-4 text-emerald-400" />}
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Goals Card */}
        <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 backdrop-blur-md space-y-6">
          <h3 className="font-bold text-white text-base border-b border-slate-900 pb-2">Preparation Focus & timeline</h3>

          {/* Target role */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              Target job Role
            </label>
            <input
              name="target_role"
              placeholder="e.g. Frontend Engineer, Android Developer"
              value={formData.target_role}
              onChange={handleChange}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
          </div>

          {/* Skill level */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2.5">Skill Level</label>
            <div className="grid grid-cols-3 gap-3">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => selectSkill(level)}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    formData.skill_level === level
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Weak areas */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              Weak Areas & Prioritized Topics
            </label>
            <textarea
              name="weak_areas"
              rows={4}
              placeholder="e.g. Dynamic Programming, DBMS SQL, Graph searches"
              value={formData.weak_areas}
              onChange={handleChange}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm resize-none"
            />
          </div>

          {/* Hours & Timeline */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
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
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
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
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-98"
          >
            {submitting ? (
              <Loader size="sm" />
            ) : (
              <>
                <Save className="h-4.5 w-4.5" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
