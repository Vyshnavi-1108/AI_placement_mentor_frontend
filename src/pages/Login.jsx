import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Terminal, ArrowRight, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", formData);
      login(response.data.access_token);
      toast.success("Welcome back! Login successful.");
      
      // Delay slightly so token fetch completes in AuthContext
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error(error);
      // Global axios interceptor already pops toast for other codes
      // We handle local state overrides here if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      {/* Left Panel: Illustration / Branding */}
      <div className="hidden md:flex md:w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1),transparent_60%)] border-r border-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract vector shape */}
        <div className="absolute top-1/3 -left-12 h-64 w-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center">
            <Terminal className="h-4.5 w-4.5 text-slate-950 font-bold" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Mentor.AI
          </span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
            Master the Placement Preparation Curve
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Gain an edge over other placement applicants with automated study metrics, real-time code execution guidance, and AI-driven mock panels.
          </p>
        </div>

        <div className="text-xs text-slate-500 relative z-10">
          © 2026 Mentor.AI. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex justify-center items-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="md:hidden flex items-center gap-2 mb-8">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center">
                <Terminal className="h-4.5 w-4.5 text-slate-950 font-bold" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Mentor.AI
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Sign In</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Enter your credentials to access your placement dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3.5 bg-slate-900 border ${
                  errors.email ? "border-red-500/80" : "border-slate-800"
                } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3.5 pr-11 bg-slate-900 border ${
                    errors.password ? "border-red-500/80" : "border-slate-800"
                  } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/10"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Alternate Link */}
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
