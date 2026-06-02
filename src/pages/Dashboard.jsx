import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [onboarding, setOnboarding] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const profileRes = await axios.get(
        "http://127.0.0.1:8000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfile(profileRes.data);

      try {
        const onboardingRes = await axios.get(
          "http://127.0.0.1:8000/api/users/onboarding",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setOnboarding(onboardingRes.data);
      } catch {
        setOnboarding(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">AI Placement Mentor</h1>

        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {profile && (
        <div className="bg-slate-900 p-6 rounded-xl mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {profile.name} 👋
          </h2>

          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>
      )}

      {onboarding ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Target Role</h3>
            <p>{onboarding.target_role}</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Skill Level</h3>
            <p>{onboarding.skill_level}</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Daily Study Hours</h3>
            <p>{onboarding.daily_study_hours}</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Placement Timeline</h3>
            <p>{onboarding.placement_timeline} Months</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl md:col-span-2">
            <h3 className="text-xl font-bold mb-3">Weak Areas</h3>
            <p>{onboarding.weak_areas}</p>
          </div>

          <div className="flex gap-4 mt-4">
            <Link to="/roadmap" className="bg-blue-600 px-6 py-3 rounded">
              View Roadmap
            </Link>

            <Link to="/chat" className="bg-green-600 px-6 py-3 rounded">
              AI Mentor Chat
            </Link>
          </div>
        </div>
      ) : (
        <Link to="/onboarding" className="bg-blue-600 px-6 py-3 rounded">
          Complete Onboarding
        </Link>
      )}
    </div>
  );
};

export default Dashboard;
